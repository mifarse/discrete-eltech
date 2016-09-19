import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'

export default class InverseTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/inverse')
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
      if (event.target.classList.contains('output')) {
        const val      = parseInt(event.target.value)
        const original = parseInt(event.target.dataset.original)
        const mod      = parseInt(this.state.input[0])
        if ((val - original) % mod === 0) {
          event.currentTarget.classList.remove('wrong')
          event.currentTarget.classList.add('ok')
        }
        else {
          event.currentTarget.classList.remove('ok')
          event.currentTarget.classList.add('wrong')
        }
      }
      else {
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
  }

  render () {
    return (
      <div className="content-wrap">
        <Toolbar />
        <h1>Нахождение обратного числа</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>Найти обратный элемент к {this.state.input[1]} в поле вычетов по модулю {this.state.input[0]} заполнив нужную часть таблицы расширенного алгоритма Евклида</p>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : null
            ))}/>
            <code className="answer-area">
              Ответ: &nbsp;
              <div className="input-number-wrap">
                <input type="number" className="output" 
                  data-original={this.state.output} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </code>
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