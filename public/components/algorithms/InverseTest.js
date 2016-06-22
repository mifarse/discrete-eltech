import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Toolbar from '../Toolbar'
import getCookie from './getCookie'

export default class InverseTest extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/inverse?id=' + getCookie('student_id'))
      .then(response => response.json())
      .then(example => {
        let inputs = ReactDOM.findDOMNode(this).querySelectorAll('input[type="number"]'); // Fuck JavaScript
        [].forEach.call(inputs, input => input.value = '')
        this.setState(example)
      })
      .catch(console.error)
  }

  check () {
    fetch('http://discrete-eltech.eurodir.ru:8888/test/inverse/', {
      method  : 'post',
      headers : new Headers({
        'Content-Type': 'application/json'
      }),
      body    : JSON.stringify({
        input   : this.state.input,
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
        <Toolbar smartTable={true}/>
        <h1>Нахождение обратного числа</h1>
        <h2>Контроль</h2>
        {this.state.input ? 
          <div>
            <p>Найти обратный элемент к {this.state.input[1]} в поле вычетов по модулю {this.state.input[0]} заполнив нужную часть таблицы расширенного алгоритма Евклида</p>
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