const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const previousValueElement = document.querySelector('[data-previous-value]');
const currentValueElement = document.querySelector('[data-current-value]');
const extraButton = document.querySelector('.extra');
const extraBlock = document.querySelector('.extra-block');
const extraBlockCalculator = document.querySelector('.calculator');
const error = 'Error!';
let computation;

class Calculator {
  constructor(previousValueElement, currentValueElement) {
    this.previousValueElement = previousValueElement;
    this.currentValueElement = currentValueElement;
    this.clear();
    this.updateDisplay();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    computation = undefined;
    this.operation = undefined;
  }

  delete() {
    if (this.currentValue === 'Error!') {
      return;
    }
    this.currentValue = this.currentValue.toString().slice(0, -1);
    if (this.currentValue === '' || this.currentValue === '-') {
      this.clear();
    }
  }

  appendNumber(number) {
    if (this.currentValue === 'Error!') {
      return;
    }
    if (
      computation !== undefined &&
      this.currentValue !== '' &&
      this.previousValue === ''
    ) {
      this.clear();
    }
    if (number === '.' && this.currentValue.includes('.')) {
      return;
    }
    if (number === '.' && this.currentValue === '') {
      this.currentValue = '0';
    }
    if (number === '0' && this.currentValue === '0') {
      return;
    }
    if (this.currentValue === '0' && number !== '.') {
      this.currentValue = '';
    }
    this.currentValue = this.currentValue.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (
      operation === '↹' ||
      (operation === '√' && this.currentValue === '0') ||
      this.currentValue === '' ||
      this.currentValue === 'Error!'
    ) {
      return;
    }

    if (operation === '±') {
      this.currentValue = -this.currentValue;
      return;
    }
    if (operation === 'xy') {
      operation = '^';
    }

    if (operation === '√' || operation === '∛') {
      if (this.currentValue > 0) {
        switch (operation) {
          case '√':
            this.currentValue = String(Math.sqrt(this.currentValue));
            break;
          case '∛':
            this.currentValue = String(Math.cbrt(this.currentValue));
            break;
        }
        operation = undefined;
        computation = this.currentValue;
        return;
      } else {
        this.currentValue = error;
        return;
      }
    }

    if (operation === 'x2' || operation === 'x3') {
      switch (operation) {
        case 'x2':
          this.currentValue = String(Math.pow(this.currentValue, 2));
          break;
        case 'x3':
          this.currentValue = String(Math.pow(this.currentValue, 3));
          break;
      }
      operation = undefined;
      computation = this.currentValue;
      return;
    }

    if (this.previousValue !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousValue = this.currentValue;
    this.currentValue = '';
  }

  compute() {
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(current)) {
      return;
    }

    switch (this.operation) {
      case '^':
        computation = prev ** current;
        break;
      case '+':
        computation = (prev * 10 + current * 10) / 10;
        break;
      case '-':
        computation = (prev * 10 - current * 10) / 10;
        break;
      case '*':
        computation = (prev * 10 * (current * 10)) / 100;
        break;
      case '÷':
        if (current === 0) {
          computation = error;
        } else {
          computation = (((prev * 10) / current) * 10) / 100;
        }
        break;
    }
    this.currentValue = String(computation);
    this.operation = undefined;
    this.previousValue = '';
  }

  updateDisplay() {
    this.currentValueElement.innerText = this.currentValue;
    if (this.operation != null) {
      this.previousValueElement.innerText = `${this.previousValue}${this.operation}`;
    } else {
      this.previousValueElement.innerText = '';
    }
  }
}

const calculator = new Calculator(previousValueElement, currentValueElement);

numberButtons.forEach((button) =>
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
);

operationButtons.forEach((button) =>
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
);

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

extraButton.addEventListener('click', () => {
  extraBlock.classList.toggle('hidden');
  extraBlockCalculator.classList.toggle('moving');
});
