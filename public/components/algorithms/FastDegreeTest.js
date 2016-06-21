import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'
import getCookie from './getCookie'

export default class FastDegreeTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/fastDegree?id=' + getCookie('student_id'))
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
    fetch('http://discrete-eltech.eurodir.ru:8888/test/fastDegree/', {
      method  : 'post',
      headers : new Headers({
        'Content-Type': 'application/json'
      }),
      body    : JSON.stringify({
        input   : this.state.input,
        table   : table,
        output  : parseInt(this.refs.output.value),
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

  render () {
    return (
      <div className="content-wrap">
        <Toolbar />
        <h1>Быстрое возведение в степень</h1>
        <h2>Контроль</h2>
        {this.state.input ? 
          <div>
            <p>Возвести {this.state.input[0]} в {this.state.input[1]}</p>
            <div className="table">
              <Table data={this.state.table.map((row, i) => row.map((col, j) => {
                return <input type="number"/>
              }))}/>
            </div>
            <code className="answer-area">
              Ответ: &nbsp;
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
          : null
        }
      </div>
    )
  }
}