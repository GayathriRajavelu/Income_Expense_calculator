const form = document.getElementById("transaction-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const resetBtn = document.getElementById("reset-btn");
const filters = document.querySelectorAll('input[name="filter"]');

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

// Add or Update Transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!description || isNaN(amount)) return;

  if (editId !== null) {
    transactions[editId] = { description, amount, type };
    editId = null;
  } else {
    transactions.push({ description, amount, type });
  }

  saveAndRender();
  form.reset();
});

// Reset
resetBtn.addEventListener("click", () => form.reset());

// Save to localStorage 
function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
  updateSummary();
}

// Render Transactions
function render() {
  transactionList.innerHTML = "";
  const filterValue = document.querySelector('input[name="filter"]:checked').value;

  transactions
    .filter(t => filterValue === "all" || t.type === filterValue)
    .forEach((t, index) => {
      const li = document.createElement("li");
      li.classList.add(t.type);
      li.innerHTML = `
        <span>${t.description} - $${t.amount.toFixed(2)}</span>
        <div class="actions">
          <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
        </div>
      `;
      transactionList.appendChild(li);
    });
}

// Update Totals
function updateSummary() {
  const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  netBalanceEl.textContent = `$${balance.toFixed(2)}`;
}

// Edit Transaction
window.editTransaction = (index) => {
  const t = transactions[index];
  descInput.value = t.description;
  amountInput.value = t.amount;
  typeSelect.value = t.type;
  editId = index;
};

// Delete Transaction
window.deleteTransaction = (index) => {
  transactions.splice(index, 1);
  saveAndRender();
};

// Filter Change
filters.forEach(filter => filter.addEventListener("change", render));

// Initial Load
render();
updateSummary();
