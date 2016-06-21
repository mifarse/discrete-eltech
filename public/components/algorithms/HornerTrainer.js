import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'

export default class HornerTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/horner')
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
      <div className="content-wrap">
        <Toolbar />
        <h1>Схема Горнера</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>Поделим многочлен {this.polynomial(this.state.input[0])} на бином ({this.polynomial([1, -1 * this.state.input[1]])})</p>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : null
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