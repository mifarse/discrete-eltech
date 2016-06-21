import React, { Component } from 'react'
import Table from '../Table'

export default class FastDegreeShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/fastDegree')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
      .catch(console.error)
  }

  render () {
    return (
      <div>
        {this.state.input ? 
          <div className="content-wrap">
            <h1>Быстрое возведение в степень</h1>
            <h2>Демонстрация</h2>
            <p>Возвести {this.state.input[0]} в {this.state.input[1]}</p>
            <p>В первую строку таблицы запишем степень в двоичной системе счисления</p>
            <p>Во второй строке числа вычисляются следующим образом: первое число - это основание, далее мы возводим это число в квадрат и если на той же позиции в верхней строке стоит 1, то еще домножаем на основание</p>
            <Table data={this.state.table.map(row => row.map(col => 
                <div className="number-wrap">{col}</div>
            ))}/>
            <code>Ответ: {this.state.output}</code>
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