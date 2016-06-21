import React, { Component, PropTypes } from 'react'
import Table from '../Table'

export default class GCDShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/nod')
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
            <h1>Наибольший общий делитель</h1>
            <h2>Демонстрация</h2>
            <p>Даны числа {this.state.input.join(', ')}.</p>
            <p>Примените к ним алгоритм Евклида (для определенности сохраняя порядок, в котором указаны исходные числа)</p>
            <p>Получим следующую таблицу:</p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
                <div className={'number-wrap' + (i == 0 && j == row.length - 2 ? ' primary-answer' : '')}>
                  {col}
                </div>
            ))}/>
            <code>НОД({this.state.input.join(', ')}) = {this.state.output}</code>
            <button onClick={e => this.refreshExample()}>Обновить</button>
          </div>
        : null}
      </div>
    )
  }
}