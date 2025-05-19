document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("transaction-form");
    const incomeTotal = document.getElementById("income-total");
    const expenseTotal = document.getElementById("expense-total");
    const balance = document.getElementById("balance");
    const transactionList = document.getElementById("transaction-list");

    let transactions = [];

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        const category = document.getElementById("category").value;
        const type = document.getElementById("type").value;

        if (isNaN(amount) || !date || !category || !type) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const transaction = { amount, date, category, type };
        transactions.push(transaction);
        updateUI();
        form.reset();
    });

    function updateUI() {
        let income = 0, expense = 0;
        transactionList.innerHTML = "";

        transactions.forEach((t) => {
            const div = document.createElement("div");
            div.className = `transaction-item ${t.type}`;
            div.innerHTML = `
        <div class="transaction-details">
          <span>${t.category}</span>
          <span>${t.date}</span>
        </div>
        <div class="transaction-meta">
          <span>$${t.amount.toFixed(2)}</span>
        </div>
      `;
            transactionList.appendChild(div);

            if (t.type === "income") income += t.amount;
            else expense += t.amount;
        });

        incomeTotal.textContent = income.toFixed(2);
        expenseTotal.textContent = expense.toFixed(2);
        balance.textContent = (income - expense).toFixed(2);
    }
});

