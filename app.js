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
        document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;
    }

    // Load saved expenses
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');

    savedExpenses.forEach(item => {
        const li = createExpenseItem(item.text, item.id);
        expenseList.appendChild(li);
    });
});

let balance = 0;

// Function to create LI with delete button
function createExpenseItem(text, id) {
    const li = document.createElement('li');
    li.textContent = text;
    li.setAttribute("data-id", id);

    // Create delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.classList.add("delete-expense");

    // Delete action
    delBtn.onclick = () => {
        li.remove();
        deleteExpenseFromStorage(id);
    };

    li.appendChild(delBtn);
    return li;
}

// Save updated expenses after delete
function deleteExpenseFromStorage(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add Balance
function addBalance() {
  const input = document.getElementById('add-balance-input');
  const amount = parseFloat(input.value);

  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;

    // Save balance
    localStorage.setItem('balance', balance);

    input.value = '';
  } else {
    alert('Please enter a valid positive number.');
  }
}

// Add Expense
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

    document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;
    localStorage.setItem('balance', balance); // Save updated balance

    // Expense Text
    const text = `${type} - ${description}: -₹${amount.toFixed(2)}`;
    const id = Date.now(); // Unique ID

    // Add to UI
    const listItem = createExpenseItem(text, id);
    document.getElementById('expense-list').appendChild(listItem);

    // Save to localStorage
    let stored = JSON.parse(localStorage.getItem("expenses")) || [];
    stored.push({ text, id });
    localStorage.setItem("expenses", JSON.stringify(stored));

    amountInput.value = '';
    descInput.value = '';
  } else {
    alert('Please enter a valid positive number and description.');
  }
}
function generatePDF() {
    const doc = new window.jspdf.jsPDF();

    // Fetch Data
    const balance = localStorage.getItem("balance") || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Categorize
    let food = [];
    let other = [];

    expenses.forEach(exp => {
        if (exp.text.startsWith("Food")) {
            food.push(exp);
        } else if (exp.text.startsWith("Other")) {
            other.push(exp);
        }
    });

    let yPos = 15;

    // Title
    doc.setFontSize(18);
    doc.text("ExpenseFlow - Expense Report", 14, yPos);
    yPos += 10;

    // Date
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 14, yPos);
    yPos += 10;

    // Balance
    doc.text("Current Balance: ₹" + balance, 14, yPos);
    yPos += 15;

    // FOOD SECTION
    if (food.length > 0) {
        doc.setFontSize(14);
        doc.text("Food & Drink Expenses", 14, yPos);
        yPos += 5;

        doc.autoTable({
            startY: yPos,
            head: [["Expense", "ID"]],
            body: food.map(e => [e.text, e.id])
        });

        yPos = doc.previousAutoTable.finalY + 10;
    }

    // OTHER SECTION
    if (other.length > 0) {
        doc.setFontSize(14);
        doc.text("Other Expenses", 14, yPos);
        yPos += 5;

        doc.autoTable({
            startY: yPos,
            head: [["Expense", "ID"]],
            body: other.map(e => [e.text, e.id])
        });

        yPos = doc.previousAutoTable.finalY + 10;
    }

    doc.save("ExpenseFlow_Report.pdf");
}
