import React, { Component } from 'react'
import Table from '../Table'

export default class axbyShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/axby1')
      .then(response => response.json())
      .then(example => {
        this.setState(example)
      })
      .catch(console.error)
  }

  render () {
    return (
      <div>
        {this.state.input ? 
          <div className="content-wrap">
            <h1>Используя расширенный алгоритм Евклида, найдите частное решение диофантова уравнения</h1>
            <h2>Демонстрация</h2>
            <p>{this.state.input[0]}x + {this.state.input[1]}y = 1</p>
            <p>{'|'}x{'|'} {'<'} {'|'}{this.state.input[1]}{'|'}, {'|'}y{'|'} {'<'} {'|'}{this.state.input[0]}{'|'}</p>
            <p>Для решения этой задачи нам необходимо воспользоваться расширенным алгоритмом Евклида, как показано в следующей таблице.</p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
                <div className={'number-wrap' + (i == 2 && j == row.length - 2 ? ' primary-answer' : '')
                  + (i == 3 && j == row.length - 2 ? ' secondary-answer' : '')}>{col}</div>
            ))}/>
            <code>Ответ: ({this.state.output.join('; ')})</code>
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