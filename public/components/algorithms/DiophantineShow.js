import React, { Component } from 'react'
import Table from '../Table'

export default class DiophantineShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/diophantine')
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
            <h1>Решение диофантова уравнения</h1>
            <h2>Демонстрация</h2>
            <p>Дано уравнение в целых числах:</p>
            <p>{this.state.input[0]}x + {this.state.input[1]}y = {this.state.input[2]}</p>
            <p>Имеющее решение, если {this.state.input[2]} делится без остатка на НОД ({this.state.input[0]}, {this.state.input[1]}) = {this.state.output.nod}</p>
            <p>Разделим коэффициенты уравнения {this.state.input[0]}, {this.state.input[1]} и {this.state.input[2]} на {this.state.output.nod} получим следующее уравнение</p>
            <p>{this.state.output.a}x + {this.state.output.b}y = {this.state.output.c}</p>
            <p>Решим уравнение</p>
            <p>{this.state.output.a}x + {this.state.output.b}y = 1</p>
            <p>применив к {this.state.output.a} и {this.state.output.b} расширенный алгоритм Евклида</p>
            <p>Полученные ответы умножим на {this.state.output.c} и получим</p>
            <p>
              X0 = {this.state.table[this.state.table.length - 2][this.state.table[0].length - 2]} * {this.state.output.c} = {this.state.output.x[0]}
              <br/>
              Y0 = {this.state.table[this.state.table.length - 1][this.state.table[0].length - 2]} * {this.state.output.c} = {this.state.output.y[0]}
            </p>
            <p>Выпишем окончательный ответ:</p>
            <p>
              X = {this.state.output.x[0]} + {this.state.output.x[1]}t
              <br/>
              Y = {this.state.output.y[0]} + {this.state.output.y[1]}t
            </p>
            <Table data={this.state.table.map((row, i) => row.map((col, j) => 
              <div className={'number-wrap' + (
                (i == 2 && j == row.length - 2) || (i == 3 && j == row.length - 1) ? 
                  ' primary-answer' : '')
                + ((i == 2 && j == row.length - 1) || (i == 3 && j == row.length - 2) ? 
                  ' secondary-answer' : '')
              }>{col}</div>
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