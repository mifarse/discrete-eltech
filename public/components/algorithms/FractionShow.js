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
      .catch(console.error)
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
            <Table data={this.state.table.map(row => row.map(col => 
                <div className="number-wrap">{col}</div>
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