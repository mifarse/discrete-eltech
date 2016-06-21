import React, { Component } from 'react'
import Table from '../Table'

export default class FractionShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/fraction')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
  }

  render () {
    return (
      <div>
        {this.state.input ? 
          <div className="content-wrap">
            <h1>Разложение в цепную дробь</h1>
            <h2>Демонстрация</h2>
            <p>Дана дробь {this.state.input[0]}/{this.state.input[1]}</p>
            <p>Возьмем {this.state.input[0]} и {this.state.input[1]} и применим алгоритм Евклида, получим следующую таблицу:</p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
                <div className={'number-wrap' + (i == 1 && j == 2 ? ' primary-answer' : '')
                  + (i == 1 && j > 2 ? ' secondary-answer' : '')}>{col}</div>
            ))}/>
            <code>Ответ: [{this.state.output.filter(x => x !== 0).join(', ')}]</code>
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