// On page load
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('greeting').innerText = `Hello, ${username}!`;
    }

    // Load saved balance
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance !== null) {
        balance = parseFloat(savedBalance);
        document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    }

    // Load saved expenses
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');

    savedExpenses.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        expenseList.appendChild(li);
    });
});

let balance = 0;

function addBalance() {
  const input = document.getElementById('add-balance-input');
  const amount = parseFloat(input.value);

  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;

    // Save balance
    localStorage.setItem('balance', balance);

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
    localStorage.setItem('balance', balance); // Save updated balance

    // Add to Expense History
    const expenseList = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${type} - ${description}: -$${amount.toFixed(2)}`;
    expenseList.appendChild(listItem);

    // Save all expenses to localStorage
    const allItems = [];
    document.querySelectorAll('#expense-list li').forEach(li => {
      allItems.push(li.textContent);
    });
    localStorage.setItem('expenses', JSON.stringify(allItems));

    amountInput.value = '';
    descInput.value = '';
  } else {
    alert('Please enter a valid positive number and description.');
  }
}
