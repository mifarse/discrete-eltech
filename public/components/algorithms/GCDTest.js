import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'
import getCookie from './getCookie'

export default class GCDTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/nod?id=' + getCookie('student_id'))
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
    fetch('http://discrete-eltech.eurodir.ru:8888/test/nod/', {
      method  : 'post',
      body    : JSON.stringify({
        input   : this.state.input,
        table   : table,
        output  : parseInt(this.refs.output.value),
        test_id : this.state.test_id,
      }),
      headers : new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(response => response.json())
      .then(response => this.setState({
        ...this.state,
        status : response.status,
      }))
      .catch(console.error)
  }

  render () {
    return (
      <div className="content-wrap">
        <Toolbar />
        <h1>Наибольший общий делитель</h1>
        <h2>Контроль</h2>
        {this.state.input ? 
          <div>
            <p>Даны числа {this.state.input.join(', ')}.</p>
            <p>Примените к ним алгоритм Евклида (для определенности сохраняя порядок, в котором указаны исходные числа)</p>
            <p>Вводите полученные значения в следующую таблицу:</p>
            <div className="table">
              <Table data={this.state.table.map((row, i) => row.map((col, j) => {
                return i > 0 && j < 2 ? <input type="number" disabled={true}/> : <input type="number"/>
              }))}/>
            </div>
            <code className="answer-area">
              Ответ: НОД({this.state.input.join(', ')}) = &nbsp;
              <div className="input-number-wrap">
                <input type="number" ref="output"/>
              </div>
            </code>
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
          : 
          ''
        }
      </div>
    )
  }
}