import React, { Component } from 'react'
import Table from '../Table'

export default class HornerShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://88.201.187.23:8888/solve/horner')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
      .catch(console.error)
  }

  polynomial (factors) {
    return factors.map((c, i) => {
      let power = factors.length - i - 1
      return c != 0 ? (
        <span>
          {c < 0 ? '-' : i > 0 ? '+' : ''}
          {Math.abs(c) !== 1 || power === 0 ? Math.abs(c) : ''}
          {power > 1 ? <span>x<sup>{power}</sup></span> : power == 1 ? 'x' : ''}
        </span>) : ''
    })
  }

  render () {
    return (
      <div>
        {this.state.input ? 
          <div className="content-wrap">
            <h1>Схема Горнера</h1>
            <h2>Демонстрация</h2>
            <p>Поделим многочлен {this.polynomial(this.state.input[0])} на бином ({this.polynomial([1, -1 * this.state.input[1]])})</p>
            <Table data={this.state.table.map(row => row.map(col => 
                <div className="number-wrap">{col}</div>
            ))}/>
            <code>Ответ: ({this.polynomial([1, -1 * this.state.input[1]])})({this.polynomial(this.state.table[1].slice(1, -1))}){this.state.table[1].slice(-1).pop() > 0 ? '+' : ''}{this.state.table[1].slice(-1).pop() !== 0 ? this.state.table[1].slice(-1).pop() : ''}
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