import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'
import getCookie from './getCookie'

export default class HornerTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/horner?id=' + getCookie('student_id'))
      .then(response => response.json())
      .then(example => {
        let inputs = ReactDOM.findDOMNode(this).querySelectorAll('input[type="number"]'); // Fuck JavaScript
        [].forEach.call(inputs, input => input.value = '')
        this.setState(example)
      })
      .catch(console.error)
  }

  check () {
    let tableNode = ReactDOM.findDOMNode(this).querySelectorAll('.table tr');
    let table = [].map.call(tableNode, tr => {
      return [].map.call(tr.querySelectorAll('input[type="number"]'), input => {
        return input.value !== '' ? parseInt(input.value) : ''
      })
    })
    fetch('http://discrete-eltech.eurodir.ru:8888/test/horner', {
      method  : 'post',
      headers : new Headers({
        'Content-Type': 'application/json'
      }),
      body    : JSON.stringify({
        input   : this.state.input,
        table   : table,
        test_id : this.state.test_id,
      }),
    })
      .then(response => response.json())
      .then(response => this.setState({
        ...this.state,
        status : response.status,
      }))
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
      <div className="content-wrap">
        <Toolbar />
        <h1>Схема Горнера</h1>
        <h2>Контроль</h2>
        {this.state.input ? 
          <div>
            <p>Поделим многочлен {this.polynomial(this.state.input[0])} на бином ({this.polynomial([1, -1 * this.state.input[1]])})</p>
            <div className="table">
              <Table data={this.state.table.map((row, i) => row.map((col, j) => {
                return i == 0 && j == 0 ? <input type="number" disabled={true}/> : <input type="number"/>
              }))}/>
            </div>
            <div className="button-wrap">
              <button onClick={e => this.check(e)}>Проверить</button>
                {this.state.status !== undefined ?
                  (this.state.status ? 
                    <i className="checker ok"></i> : <i className="checker wrong"></i>
                  )
                  : null
                }
            </div>
          </div>
          : null
        }
      </div>
    )
  }
}