import React, { Component } from 'react'
import Table from '../Table'

export default class ConvergentsShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/convergents')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
      .catch(console.error)
  }

  render () {
    let output = []
    if (this.state.input) {
      for (let i = 2; i < this.state.table[2].length; i++) {
        if (this.state.table[2][i] !== 0) {
          output.push([this.state.table[2][i], this.state.table[3][i]])
        }
      }
    }
    return (
      <div>
        {this.state.input ? 
          <div className="content-wrap">
            <h1>Нахождение подходящих дробей</h1>
            <h2>Демонстрация</h2>
            <p>Дана дробь {this.state.input[0]}/{this.state.input[1]}</p>
            <p>Возьмем {this.state.input[0]} и {this.state.input[1]} и применим расширенный алгоритм Евклида для подходящих дробей.</p>
            <p>Получим следующую таблицу:</p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
                <div className={'number-wrap' + (i == 2 && j > 1 ? ' primary-answer' : '')
                  + (i == 3 && j > 1 ? ' secondary-answer' : '')}>{col}</div>
            ))}/>
            <code>Ответ: [{output.map(f => f[0] + '/' + f[1]).join(', ')}]</code>
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