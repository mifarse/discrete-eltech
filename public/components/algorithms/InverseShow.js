import React, { Component } from 'react'
import Table from '../Table'

export default class InverseShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://88.201.187.23:8888/solve/inverse')
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
            <h1>Нахождение обратного числа</h1>
            <h2>Демонстрация</h2>
            <p>Найти обратный элемент к {this.state.input[0]} в поле вычетов по модулю b. Класс вычетов определяется остатком по модулю {this.state.input[1]}. Или другими словами мы имеем уравнение</p>
            <p>{this.state.input[0]}x = 1 mod {this.state.input[1]}</p>
            <p>где x обратное число, перейдём к уравнению</p>
            <p>{this.state.input[0]}x - {this.state.input[1]}y = 1</p>
            <p>применим к {this.state.input[0]} и {this.state.input[1]} расширенный алгоритм Евклида. Если x &lt; 0 нужно прибавить к нему модуль кольца вычетов</p>
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