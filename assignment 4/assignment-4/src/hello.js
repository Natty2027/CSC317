const display = document.getElementById("display");
let current = "0";
let previous = "";
let operator = null;
let resetDisplay = false;

function updateDisplay(value) {
    display.textContent = value;
}

function handleNumber(num) {
    if (resetDisplay || current === "0") {
        current = num === "." ? "0." : num;
        resetDisplay = false;
    } else {
        if (num === "." && current.includes(".")) return;
        current += num;
    }
    updateDisplay(current);
}

function handleOperator(op) {
    if (operator && !resetDisplay) {
        calculate();
    }
    previous = current;
    operator = op;
    resetDisplay = true;
}

function calculate() {
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operator) {
        case "+":
            result = prev + curr;
            break;
        case "-":
            result = prev - curr;
            break;
        case "*":
            result = prev * curr;
            break;
        case "/":
            result = curr === 0 ? "Error" : prev / curr;
            break;
        default:
            return;
    }

    current = result.toString();
    operator = null;
    previous = "";
    resetDisplay = true;
    updateDisplay(current);
}

function clearAll() {
    current = "0";
    previous = "";
    operator = null;
    resetDisplay = false;
    updateDisplay(current);
}

function toggleSign() {
    if (current === "0") return;
    current = (parseFloat(current) * -1).toString();
    updateDisplay(current);
}

function percentage() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay(current);
}

document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (value !== undefined) {
            handleNumber(value);
        } else if (action) {
            switch (action) {
                case "clear":
                    clearAll();
                    break;
                case "sign":
                    toggleSign();
                    break;
                case "percent":
                    percentage();
                    break;
                case "operator":
                    handleOperator(btn.dataset.value);
                    break;
                case "equals":
                    calculate();
                    break;
            }
        }
    });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || e.key === ".") {
        handleNumber(e.key);
    }

    if (["+", "-", "*", "/"].includes(e.key)) {
        handleOperator(e.key);
    }

    if (e.key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (e.key === "Escape") {
        clearAll();
    }

    if (e.key === "Backspace") {
        current = current.length > 1 ? current.slice(0, -1) : "0";
        updateDisplay(current);
    }
});
