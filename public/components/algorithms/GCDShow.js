import React, { Component, PropTypes } from 'react'
import Table from '../Table'

export default class GCDShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://88.201.187.23:8888/solve/nod')
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
            <p>Применим к ним алгоритм Евклида.</p>
            <p>Получим следующую таблицу:</p>
            <Table data={this.state.table.map(row => row.map(col => 
                <div className="number-wrap">{col}</div>
            ))}/>
            <code>НОД({this.state.input.join(', ')}) = {this.state.output}</code>
            <button onClick={e => this.refreshExample()}>Обновить</button>
          </div>
        : null}
      </div>
    )
  }
}