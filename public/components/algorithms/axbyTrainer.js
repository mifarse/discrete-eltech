import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'

export default class axbyTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/axby1')
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

  render () {
    return (
      <div className="content-wrap">
        <Toolbar />
        <h1>Используя расширенный алгоритм Евклида, найдите частное решение диофантова уравнения</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>{this.state.input[0]}x + {this.state.input[1]}y = 1</p>
            <p>{'|'}x{'|'} {'<'} {'|'}{this.state.input[1]}{'|'}, {'|'}y{'|'} {'<'} {'|'}{this.state.input[0]}{'|'}</p>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : null
            ))}/>
            <code className="answer-area">
              Ответ: X = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output[0]} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
              &nbsp;Y = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output[1]} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </code>
            <button onClick={e => this.refreshExample()}>Обновить</button>
          </div>
          : null
        }
      </div>
    )
  }
}