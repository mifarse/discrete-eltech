import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'

export default class DiophantineTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://88.201.187.23:8888/test/diophantine')
      .then(response => response.json())
      .then(example => {
        let inputs = ReactDOM.findDOMNode(this).querySelectorAll('input[type="number"]'); // Fuck JavaScript
        [].forEach.call(inputs, input => input.value = '')
        this.setState(example)
      })
      .catch(console.error)
  }

  check () {
    let output = {
      nod : this.refs.nod.value,
      a1  : this.refs.a1.value,
      b1  : this.refs.b1.value,
      c1  : this.refs.c1.value,
      x   : [this.refs.x0.value, this.refs.x1.value],
      y   : [this.refs.y0.value, this.refs.y1.value],
    }
    fetch('http://88.201.187.23:8888/test/diophantine/', {
      method  : 'post',
      headers : new Headers({
        'Content-Type': 'application/json'
      }),
      body    : JSON.stringify({
        input   : this.state.input,
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
        <h1>Решение диофантово уравнения</h1>
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