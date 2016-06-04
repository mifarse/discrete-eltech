import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'

export default class GCDTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://88.201.187.23:8888/solve/nod')
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
        <h1>Наибольший общий делитель</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>Даны числа {this.state.input.join(', ')}.</p>
            <p>Применим к ним алгоритм Евклида.</p>
            <p>Вводите полученные значения в следующую таблицу:</p>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : ''
            ))}/>
            <code className="answer-area">
              НОД({this.state.input.join(', ')}) = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </code>
            <button onClick={e => this.refreshExample()}>Обновить</button>
          </div>
          : 
          ''
        }
      </div>
    )
  }
}