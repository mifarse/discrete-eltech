import React, {Component} from 'react'
import SmartTable from './SmartTable'

export default class Toolbar extends Component {

    toggle (e) {
        $(e.target).parent().next().collapse('toggle');
    }

    componentDidMount() {
        var input = this.refs.root.querySelector('#input'), // input/output button
          number = this.refs.root.querySelectorAll('.numbers div'), // number buttons
          operator = this.refs.root.querySelectorAll('.operators div'), // operator buttons
          result = this.refs.root.querySelector('#result'), // equal button
          clear = this.refs.root.querySelector('#clear'), // clear button
          resultDisplayed = false; // flag to keep an eye on what output is displayed

        // adding click handlers to number buttons
        for (var i = 0; i < number.length; i++) {
          number[i].addEventListener("click", function(e) {

            // storing current input string and its last character in variables - used later
            var currentString = input.innerHTML;
            var lastChar = currentString[currentString.length - 1];

            // if result is not diplayed, just keep adding
            if (resultDisplayed === false) {
              input.innerHTML += e.target.innerHTML;
            } else if (resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷" || lastChar === "%") {
              // if result is currently displayed and user pressed an operator
              // we need to keep on adding to the string for next operation
              resultDisplayed = false;
              input.innerHTML += e.target.innerHTML;
            } else {
              // if result is currently displayed and user pressed a number
              // we need clear the input string and add the new input to start the new opration
              resultDisplayed = false;
              input.innerHTML = "";
              input.innerHTML += e.target.innerHTML;
            }

          });
        }

        // adding click handlers to number buttons
        for (var i = 0; i < operator.length; i++) {
          operator[i].addEventListener("click", function(e) {

            // storing current input string and its last character in variables - used later
            var currentString = input.innerHTML;
            var lastChar = currentString[currentString.length - 1];

            // if last character entered is an operator, replace it with the currently pressed one
            if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷" || lastChar === "%") {
              var newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
              input.innerHTML = newString;
            } else if (currentString.length == 0) {
              // if first key pressed is an opearator, don't do anything
              console.log("enter a number first");
            } else {
              // else just add the operator pressed to the input
              input.innerHTML += e.target.innerHTML;
            }

          });
        }

        // on click of 'equal' button
        result.addEventListener("click", function() {

          // this is the string that we will be processing eg. -10+26+33-56*34/23
          var inputString = input.innerHTML;

          // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]
          var numbers = inputString.split(/\+|\-|\×|\÷|\%/g);

          // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
          // first we replace all the numbers and dot with empty string and then split
          var operators = inputString.replace(/[0-9]|\./g, "").split("");

          console.log(inputString);
          console.log(operators);
          console.log(numbers);
          console.log("----------------------------");

          // now we are looping through the array and doing one operation at a time.
          // first divide, then multiply, then subtraction and then addition
          // as we move we are alterning the original numbers and operators array
          // the final element remaining in the array will be the output

          var divide = operators.indexOf("÷");
          while (divide != -1) {
            numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
            operators.splice(divide, 1);
            divide = operators.indexOf("÷");
          }

          var multiply = operators.indexOf("×");
          while (multiply != -1) {
            numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
            operators.splice(multiply, 1);
            multiply = operators.indexOf("×");
          }

          var subtract = operators.indexOf("-");
          while (subtract != -1) {
            numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
            operators.splice(subtract, 1);
            subtract = operators.indexOf("-");
          }

          var add = operators.indexOf("+");
          while (add != -1) {
            // using parseFloat is necessary, otherwise it will result in string concatenation :)
            numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
            operators.splice(add, 1);
            add = operators.indexOf("+");
          }

          var percent = operators.indexOf("%");
          while (percent != -1) {
            // using parseFloat is necessary, otherwise it will result in string concatenation :)
            numbers.splice(percent, 2, parseFloat(numbers[percent]) % parseFloat(numbers[percent + 1]));
            operators.splice(percent, 1);
            percent = operators.indexOf("%");
          }

          input.innerHTML = numbers[0]; // displaying the output

          resultDisplayed = true; // turning flag if result is displayed
        });

        // clearing the input on press of clear
        clear.addEventListener("click", function() {
          input.innerHTML = "";
        })
    }

    render () {
        return (
            <div className="panel-group" ref="root">
                {this.props.smartTable ? 
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <button type="button" className="btn btn-default btn-xs spoiler-trigger" data-toggle="collapse" onClick={e => this.toggle(e)}>Расширенный алгоритм Евклида</button>
                        </div>
                        <div className="panel-collapse collapse out">
                            <div className="panel-body">
                                <SmartTable />
                            </div>
                        </div>
                    </div>
                    : null
                }
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <button type="button" className="btn btn-default btn-xs spoiler-trigger" data-toggle="collapse" onClick={e => this.toggle(e)}>Калькулятор</button>
                    </div>
                    <div className="panel-collapse collapse out">
                        <div className="panel-body">
                            <div className="calculator">
                              <div className="input" id="input"></div>
                              <div className="buttons">
                                <div className="operators">
                                  <div>+</div>
                                  <div>-</div>
                                  <div>&times;</div>
                                  <div>&divide;</div>
                                  <div>&#37;</div>
                                </div>
                                <div className="leftPanel">
                                  <div className="numbers">
                                    <div>7</div>
                                    <div>8</div>
                                    <div>9</div>
                                  </div>
                                  <div className="numbers">
                                    <div>4</div>
                                    <div>5</div>
                                    <div>6</div>
                                  </div>
                                  <div className="numbers">
                                    <div>1</div>
                                    <div>2</div>
                                    <div>3</div>
                                  </div>
                                  <div className="numbers">
                                    <div>0</div>
                                    <div>.</div>
                                    <div id="clear">C</div>
                                  </div>
                                </div>
                                <div className="equal" id="result">=</div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Toolbar.propTypes    = { smartTable: React.PropTypes.bool };
Toolbar.defaultProps = { smartTable : false }