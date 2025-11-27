// js/script.js

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('greeting').innerText = `Hello, ${username}!`;
    }
});

// app.js

// app.js
// app.js

let balance = 0;

function addBalance() {
  const input = document.getElementById('add-balance-input');
  const amount = parseFloat(input.value);

  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    input.value = '';
  } else {
    alert('Please enter a valid positive number.');
  }
}

function addExpense(type) {
  let amountInput, descInput;

  if (type === 'Food') {
    amountInput = document.getElementById('food-expense-input');
    descInput = document.getElementById('food-expense-desc');
  } else if (type === 'Other') {
    amountInput = document.getElementById('other-expense-input');
    descInput = document.getElementById('other-expense-desc');
  }

  const amount = parseFloat(amountInput.value);
  const description = descInput.value.trim();

  if (!isNaN(amount) && amount > 0 && description !== '') {
    balance -= amount;
    if (balance < 0) balance = 0;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;

    // Create and add new list item to Expense History
    const expenseList = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${type} - ${description}: -$${amount.toFixed(2)}`;
    expenseList.appendChild(listItem);

    // Clear inputs
    amountInput.value = '';
    descInput.value = '';
  } else {
    alert('Please enter a valid positive number and description.');
  }
}





