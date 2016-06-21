import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'
import getCookie from './getCookie'

export default class DiophantineTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/diophantine?id=' + getCookie('student_id'))
      .then(response => response.json())
      .then(example => {
        console.log(example)
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
    let output = {
      nod : parseInt(this.refs.nod.value),
      a   : parseInt(this.refs.a1.value),
      b   : parseInt(this.refs.b1.value),
      c   : parseInt(this.refs.c1.value),
      x   : [parseInt(this.refs.x0.value), parseInt(this.refs.x1.value)],
      y   : [parseInt(this.refs.y0.value), parseInt(this.refs.y1.value)],
    }
    fetch('http://discrete-eltech.eurodir.ru:8888/test/diophantine/', {
      method  : 'post',
      headers : new Headers({
        'Content-Type': 'application/json'
      }),
      body    : JSON.stringify({
        input   : this.state.input,
        table   : table,
        output  : output,
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
        <Toolbar smartTable={true}/>
        <h1>Решение диофантова уравнения</h1>
        <h2>Контроль</h2>
        {this.state.input ? 
          <div>
            <p>Решите уравение: {this.state.input[0]}x + {this.state.input[1]}y = {this.state.input[2]}</p>
            <div className="answer-area">
              НОД ({this.state.input.join(', ')}) = &nbsp;
              <div className="input-number-wrap inline">
                <input type="number" ref="nod"/>
              </div>
            </div>
            <div className="answer-area">
              a1 = &nbsp;
              <div className="input-number-wrap inline">
                <input type="number" ref="a1"/>
              </div>
              &nbsp;b1 = &nbsp;
              <div className="input-number-wrap inline">
                <input type="number" ref="b1"/>
              </div>
              &nbsp;c1 = &nbsp;
              <div className="input-number-wrap inline">
                <input type="number" ref="c1"/>
              </div>
            </div>
            <p>Где a1, b1, c1 - сокращенные коэффиценты уравнения</p>
            <p>Ответ:</p>
            <div>
              <div className="answer-area">
                X = &nbsp;
                <div className="input-number-wrap inline">
                  <input type="number" ref="x0"/>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap inline">
                  <input type="number" ref="x1"/>
                </div>
                t
              </div>
              <div className="answer-area">
              Y = &nbsp;
                <div className="input-number-wrap inline">
                  <input type="number" ref="y0"/>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap inline">
                  <input type="number" ref="y1"/>
                </div>
                t
              </div>
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