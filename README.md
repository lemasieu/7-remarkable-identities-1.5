# 7 Remarkable Identities Quiz - Version 1.5

An interactive, web-based mathematical quiz application designed to help students master the **7 Remarkable Algebraic Identities** (Hằng đẳng thức đáng nhớ) through a dynamic subjective (fill-in-the-blank) format.

This repository represents **Version 1.5**, which focuses on standard textbook-level difficulty by simplifying internal exponents to keep the focus on the fundamental structures of algebraic identities.

👉 **Live Demo:** [https://xn--msiu-goa8b.vn/github/7-remarkable-identities-1.5/](https://xn--msiu-goa8b.vn/github/7-remarkable-identities-1.5/)

---

## 🌟 Key Features

* **Subjective / Fill-in-the-Blank Format:** Shifts away from multiple-choice questions to a real-world testing approach where users must manually input their answers.
* **Smart Canonicalization Engine (Intellectual Grading):** Mathematically interprets user input rather than performing a simple string comparison. It automatically:
  * Eliminates white spaces and implicit multiplication dots (`.`).
  * Normalizes and synchronizes exponent characters (`^` vs HTML `<sup>`).
  * Tokenizes polynomials and sorts internal terms alphabetically (e.g., both `a^2 + 2ab + b^2` and `b^2 + 2ab + a^2` are correctly evaluated as **Correct**).
  * Smoothly handles and reorders multi-parenthesis structures.
* **Curated Difficulty (v1.5 Standard):** Internal exponents of individual variables are capped at 1, generating clean, standard problems like $(2x - y)^2$, $(3a + 4b)^3$, or $8x^3 - y^3$ without overwhelming exponents inside the parentheses.
* **Real-time Live Preview:** As users type using their physical keyboard or the integrated layout, their raw text input (e.g., `x^2`) is instantly formatted into crisp mathematical notation (`x²`) right below the input box.
* **Smart Virtual Math Keyboard:** Includes built-in assistant buttons for symbols like `+`, `-`, `^`, `(`, and `)`. The virtual buttons safely inject characters directly at the user's active cursor blinking position instead of blindly appending to the end.

---

## 🛠️ Tech Stack & Structure

The project is built entirely using vanilla web technologies without any heavy frameworks, ensuring blazing-fast performance and offline compatibility.
```
├── index.html   # Main layout structure with input system & live preview
├── style.css    # Responsive modern dark-theme user interface
└── script.js    # Core mathematical generation, UI logic, and grading engine
```

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/lemasieu/7-remarkable-identities-1.5.git](https://github.com/lemasieu/7-remarkable-identities-1.5.git)
   ```
   
2. **Navigate to the directory:**
   ```bash
   cd 7-remarkable-identities-1.5
   ```
   
3. **Open the application:**
Simply double-click the `index.html` file to launch it in any modern web browser, or serve it via a local development server extension (like Live Server in VS Code).

---

## 📝 License

This project is licensed under the terms of the MIT License. You are completely free to use, modify, and distribute it.
Created by Gemini with my idea.
