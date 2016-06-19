import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'

export default class DiophantineTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/diophantine')
      .then(response => response.json())
      .then(example => {
        let inputs = ReactDOM.findDOMNode(this).querySelectorAll('input[type="number"]'); // Fuck JavaScript
        [].forEach.call(inputs, input => {
          input.value = ''
          input.classList.remove('ok')
          input.classList.remove('wrong')
        })
        this.setState(example)
      })
      .catch(console.error)
  }

  check (event) {
    if (event.currentTarget.value != '') {
      if (event.currentTarget.value === event.currentTarget.dataset.original) {
        event.currentTarget.classList.remove('wrong')
        event.currentTarget.classList.add('ok')
      }
      else {
        event.currentTarget.classList.remove('ok')
        event.currentTarget.classList.add('wrong')
      }
    }
  }

  render () {
    return (
      <div className="content-wrap">
        <h1>Решение диофантово уравнения</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>Решите уравение: {this.state.input[0]}x + {this.state.input[1]}y = {this.state.input[2]}</p>
            <div className="answer-area">
              НОД ({this.state.input.join(', ')}) = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.nod} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </div>
            <div className="answer-area">
              a1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.a} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
              &nbsp;b1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.b} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
              &nbsp;c1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.c} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </div>
            <p>Ответ:</p>
            <div>
              <div className="answer-area">
                X = &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.x[0]} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.x[1]} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
                &nbsp;t
              </div>
              <div className="answer-area">
                Y = &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.y[0]} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.y[1]} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
                &nbsp;t
              </div>
            </div>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : null
            ))}/>
            <div className="button-wrap">
              <button onClick={e => this.refreshExample()}>Обновить</button>
            </div>
          </div>
          : null
        }
      </div>
    )
  }
}