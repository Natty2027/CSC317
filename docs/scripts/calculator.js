// ===== Calculator Logic =====
const display = document.getElementById("display");
const memIndicator = document.getElementById("memory-indicator");

let current = "0";
let previous = "";
let operator = null;
let resetDisplay = false;
let memory = 0;

function updateDisplay(value) {
    display.querySelector("span#current-value").textContent = value;
}

function updateMemoryIndicator() {
    if (memory !== 0) {
        memIndicator.classList.add("active");
    } else {
        memIndicator.classList.remove("active");
    }
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
    if (operator && !resetDisplay) calculate();
    previous = current;
    operator = op;
    resetDisplay = true;
}

function calculate() {
    if (!operator || !previous) return;
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operator) {
        case "+": result = prev + curr; break;
        case "-": result = prev - curr; break;
        case "*": result = prev * curr; break;
        case "/": result = curr === 0 ? "Error" : prev / curr; break;
        default: return;
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
    current = (parseFloat(current) * -1).toString();
    updateDisplay(current);
}

function percentage() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay(current);
}

// Memory Functions
function memoryAdd() {
    memory += parseFloat(current);
    updateMemoryIndicator();
}

function memorySubtract() {
    memory -= parseFloat(current);
    updateMemoryIndicator();
}

function memoryRecall() {
    current = memory.toString();
    updateDisplay(current);
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
}

// ===== Theme Switcher =====
const themeLink = document.getElementById("theme-link");
const calculator = document.getElementById("calculator");
const body = document.body;
const buttons = document.querySelectorAll(".btn");
const switcherButton = document.getElementById("theme-switcher-button");

const themes = [
    { name: "ff", class: "ff-theme", file: "styles/ff-theme.css" },
    { name: "cod", class: "cod-theme", file: "styles/cod-theme.css" },
    { name: "default", class: "default-theme", file: "styles/default-theme.css" }
];

let currentThemeIndex = 0;

function switchTheme() {
    const current = themes[currentThemeIndex];

    body.classList.remove(current.class);
    calculator.classList.remove(current.class);
    display.classList.remove(current.class);
    buttons.forEach(btn => {
        btn.className = btn.className
            .replace(new RegExp(`\\b${current.name}-gray\\b`, 'g'), "")
            .replace(new RegExp(`\\b${current.name}-dark\\b`, 'g'), "")
            .replace(new RegExp(`\\b${current.name}-orange\\b`, 'g'), "")
            .replace(new RegExp(`\\b${current.name}-wide\\b`, 'g'), "")
            .trim();
    });

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const next = themes[currentThemeIndex];

    themeLink.setAttribute("href", next.file);
    body.classList.add(next.class);
    calculator.classList.add(next.class);
    display.classList.add(next.class);

    buttons.forEach(btn => {
        let themeClass = "";

        if (btn.dataset.action === "clear" || btn.dataset.action === "sign" || btn.dataset.action === "percent" || btn.dataset.action?.startsWith("memory")) {
            themeClass = `${next.name}-gray`;
        } else if (btn.dataset.action === "operator" || btn.dataset.action === "equals") {
            themeClass = `${next.name}-orange`;
        } else if (btn.dataset.value !== undefined) {
            themeClass = `${next.name}-dark`;
        }

        btn.classList.add(themeClass);

        if (btn.textContent === "0") {
            btn.classList.add(`${next.name}-wide`);
        }
    });
}

switcherButton.addEventListener("click", switchTheme);

// ===== Button Click Events =====
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (action === "clear") clearAll();
        else if (action === "sign") toggleSign();
        else if (action === "percent") percentage();
        else if (action === "operator") handleOperator(value);
        else if (action === "equals") calculate();
        else if (action === "memory-add") memoryAdd();
        else if (action === "memory-subtract") memorySubtract();
        else if (action === "memory-recall") memoryRecall();
        else if (action === "memory-clear") memoryClear();
        else if (value !== undefined) handleNumber(value);
    });
});

// ===== Keyboard Support =====
window.addEventListener("keydown", e => {
    if ("0123456789.".includes(e.key)) handleNumber(e.key);
    else if (["+", "-", "*", "/"].includes(e.key)) handleOperator(e.key);
    else if (e.key === "Enter") calculate();
    else if (e.key === "Backspace") clearAll();
});
