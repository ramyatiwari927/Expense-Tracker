if (typeof window !== "undefined") {
    const Balance = document.getElementById("balance");
    const money_plus = document.getElementById('money-plus');
    const money_minus = document.getElementById('money-minus');
    const list = document.getElementById("list");
    const form = document.getElementById('form');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');

    const localStorageTransaction = JSON.parse(localStorage.getItem('transaction'));
    let transactions = localStorage.getItem('transaction') !== null ? localStorageTransaction : [];

    // Add transaction
    function addTransaction(e) {
        e.preventDefault(); // Fix typo here
        if (text.value.trim() === '' || amount.value.trim() === '') {
            alert("Please enter text and value");
        } else {
            const newTransaction = { // Use a different name here
                id: generateID(),
                text: text.value,
                amount: +amount.value
            };

            transactions.push(newTransaction); // Push the new transaction to the global array
            addTransactionDOM(newTransaction);
            updateLocalStorage();
            updateValues();
            text.value = "";
            amount.value = "";
        }
    }

    // Generate id 
    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }

    function addTransactionDOM(transaction) {
        const sign = transaction.amount < 0 ? "-" : "+";
        const item = document.createElement("li");

        item.classList.add(transaction.amount < 0 ? "minus" : "plus");

        item.innerHTML = `
            ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        list.appendChild(item);
    }

    // Remove transaction
    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        Init();
    }

    // Update values
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

        Balance.innerText = `$${total}`; // Fix variable name case sensitivity
        money_plus.innerText = `$${income}`;
        money_minus.innerText = `$${expense}`;
    }

    // Update local storage
    function updateLocalStorage() {
        localStorage.setItem("transaction", JSON.stringify(transactions));
    }

    // Init App
    function Init() {
        list.innerHTML = "";
        transactions.forEach(addTransactionDOM);
        updateValues();
    }

    Init();

    form.addEventListener("submit", addTransaction);
}
