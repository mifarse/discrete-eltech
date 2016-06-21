import React, { Component } from 'react'
import Table from '../Table'

export default class HornerShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/horner')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
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
            <p>Составим таблицу из двух строк</p>
            <p>В первой строке запишем коэффициенты многочлена {this.polynomial(this.state.input[0])}, расположенные по убыванию степеней переменной x</p>
            <p>Так как мы делим на ({this.polynomial([1, -1 * this.state.input[1]])}), то во второй строке запишем {this.state.input[1]}</p>
            <p>Во вторую ячейку второй строки запишем число {this.state.input[0][0]}, просто перенеся его из соответствующей ячейки первой строки</p>
            <p>Следующую ячейку заполним по такому принципу: {this.state.input[1]} * {this.state.input[0][0]} + {this.state.input[0][1]} = {this.state.table[1][2]}</p>
            <p>Аналогично заполним и четвертую ячейку второй строки: {this.state.input[1]} * {this.state.table[1][2]} + {this.state.input[0][2]} = {this.state.table[1][3]}, и так далее</p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
                <div className={'number-wrap' + (i == 1 && (j > 0 && j < (row.length - 1)) ? 
                  ' primary-answer' : '') + (i == 1 && j == row.length - 1 ? ' secondary-answer' : '')}>
                  {col}
                </div>
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