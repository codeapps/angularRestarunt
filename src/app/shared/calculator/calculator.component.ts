import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  private stack: (number | string)[];
  display: string;
  tempHistory: string = '';
  calcHistory: string;
  historyData = [{keys: '', result: ''}];
  history_Pop: boolean = false;
  equalClick = false;
  constructor(public dialogRef: MatDialogRef<CalculatorComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any ) {
    
   }

  ngOnInit() {
    this.display = '0';
    this.stack = ['='];
 
  }

  numberPressed(val: string) {
    if (typeof this.stack[this.stack.length - 1] !== 'number') {
      this.display = val;
      this.stack.push(parseFloat(this.display));
    } else {
      this.display += val;
      this.stack[this.stack.length - 1] = parseFloat(this.display);
    }
    this.tempHistory += val;  
  }

  round(value, decimals) {
    return Number(Math.round(value + decimals) + value + decimals);
}

  operatorPressed(val: string) {
    const precedenceMap = { '+': 0, '-': 0, '*': 1, '/': 1 };
    this.ensureNumber();
    const precedence = precedenceMap[val];
    let reduce = true;
    while (reduce) {
      let i = this.stack.length - 1;
      let lastPrecedence = 100;

      while (i >= 0) {
        if (typeof this.stack[i] === 'string') {
          lastPrecedence = precedenceMap[this.stack[i]];
          break;
        }
        i--;
      }
      if (precedence <= lastPrecedence) {
        reduce = this.reduceLast();
      } else {
        reduce = false;
      }
    }
   
    if (parseFloat(this.display)) {
      this.tempHistory += val;
      this.calcHistory = this.tempHistory;
      this.stack.push(val);
    }
    
    if (this.equalClick) {
      this.tempHistory = this.display += val;
      this.equalClick = false;
    }
  }

  equalPressed() {
    
    this.ensureNumber();
       while (this.reduceLast()) { }
    this.stack.pop();
  
    let dataCalc = {keys: this.tempHistory, result: this.display}
    this.tempHistory = '=';
    this.tempHistory = this.display;
    this.calcHistory = '';
    this.historyData.push(dataCalc)
   if (this.display) {
     this.equalClick = true;
   }
  }

  percentPressed() {
    this.ensureNumber();
    const num1:any = this.stack[1];
    const num2:any = this.stack[3];
    const operator = this.stack[2];
    let result = this.stack.pop();
    if(operator == '-' || operator == '+') {
      result = (num1*num2) as number / 100;
     } else {
      while (this.reduceLast()) { };
      result = this.stack.pop() as number / 100;
     }
    this.display = result.toString(10);
    this.calcHistory += this.display;
    this.tempHistory = this.calcHistory;
    // this.stack.push(this.display);
    
  }

  acPressed() {
    this.stack = ['='];
    this.display = '0';
    this.tempHistory = '';
    this.calcHistory = '';
  }

  cePressed() {
    if (typeof this.stack[this.stack.length - 1] === 'number') { this.stack.pop(); }
    this.display = '0';
   
  }

  backPrssed() {
    if (this.display.length) {
      this.display = this.display.substring(0, this.display.length - 1);
      this.tempHistory = this.display;
    }
    if (this.display.length == 0) {
      this.display = '0';
      this.tempHistory = '';
    }

  }
  private ensureNumber() {
    
    if (typeof this.stack[this.stack.length - 1] === 'string') {
      this.stack.push(parseFloat(this.display));
    }
   
  }

  private reduceLast() {
    if (this.stack.length < 4) { return false; }
    const num2 = this.stack.pop() as number;
    const op = this.stack.pop() as string;
    const num1 = this.stack.pop() as number;
    let result = num1;
    switch (op) {
      case '+': result = num1 + num2;
        break;
      case '-': result = num1 - num2;
        break;
      case '*': result = num1 * num2;
        break;
      case '/': result = num1 / num2;
        break;
    }
    this.stack.push(result);
    this.display = result.toString(10);
    return true;
  }

  @HostListener('keydown', ['$event'])
  onkeyup(event) {
  event.preventDefault();

    switch (event.keyCode) {
      case 96:
        this.numberPressed('0');
        break;
      case 97:
        this.numberPressed('1');
        break;
      case 98:
        this.numberPressed('2');
        break;
      case 99:
        this.numberPressed('3');
        break;
      case 100:
        this.numberPressed('4');
        break;
      case 101:
        this.numberPressed('5');
        break;
      case 102:
        this.numberPressed('6');
        break;
      case 103:
        this.numberPressed('7');
        break;
      case 104:
        this.numberPressed('8');
        break;
      case 105:
        this.numberPressed('9');
        break;
      case 110:
        this.numberPressed('.');
        break;
      case 8:
        this.backPrssed();;
        break;
      case 106:
        this.operatorPressed('*');
        break;
      case 111:
        this.operatorPressed('/');
        break;
      case 109:
        this.operatorPressed('-');
        break;
      case 107:
        this.operatorPressed('+');
        break;
      case 187:
        this.equalPressed();
        break;
      case 13:
        this.equalPressed();
        break;
      case 53: 
      if (event.shiftKey) {
        this.percentPressed();
      }
      break;
      default:
        break;
    }

  }
}
