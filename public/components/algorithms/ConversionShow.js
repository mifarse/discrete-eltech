import React, { Component } from 'react'
import Table from '../Table'

export default class ConversionShow extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/conversion')
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
            <h1>Перевод из одной системы счисления в другую</h1>
            <h2>Демонстрация</h2>
            <p>Певевести {this.state.input[0]}<sub>{this.state.input[1]}</sub> в систему счисления с основанием {this.state.input[2]}</p>
            <Table data={this.state.table.map(row => row.map(col => 
                <div className="number-wrap">{col}</div>
            ))}/>
            <code>Ответ: {this.state.output}<sub>{this.state.input[2]}</sub></code>
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