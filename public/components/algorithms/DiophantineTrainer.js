import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Table from '../Table'
import Toolbar from '../Toolbar'

export default class DiophantineTrainer extends Component {

  constructor (props) {
    super(props)
    this.refreshExample()
  }

  state = {}

  refreshExample () {
    fetch('http://discrete-eltech.eurodir.ru:8888/solve/diophantine')
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
      if (event.currentTarget.closest('.output')) {
        let a1 = this.refs.a1
        let a2 = this.refs.a2
        let b1 = this.refs.b1
        let b2 = this.refs.b2
        if (a1.value && a2.value && b1.value && b2.value) {
          let class_x = (parseInt(a1.value) - parseInt(a1.dataset.original)) % 
            parseInt(b1.dataset.original) === 0;
          let class_y = (parseInt(a2.value) - parseInt(a2.dataset.original)) % 
            parseInt(b2.dataset.original) === 0;
          console.log('tc = ', a1.value*this.state.input[0]+a2.value*this.state.input[1])
          let t_c = a1.value*this.state.input[0]+a2.value*this.state.input[1] === this.state.input[2];
          let t_x = Math.abs(parseInt(b1.value)) == Math.abs(parseInt(b1.dataset.original));
          let t_y = Math.abs(parseInt(b2.value)) == Math.abs(parseInt(b2.dataset.original));  
          let t_s = parseInt(b1.value) * parseInt(b2.value) < 0;
          console.log(class_y, class_x, t_x, t_y, t_s, t_c)
          if (class_y && class_x && t_x && t_y && t_s && t_c) {
            let inputs = this.refs.outputWrap.querySelectorAll('input[type=number]');
            [].forEach.call(inputs, input => {
              input.classList.remove('wrong')
              input.classList.add('ok')
            })
          }
          else {
            let inputs = this.refs.outputWrap.querySelectorAll('input[type=number]');
            [].forEach.call(inputs, input => {
              input.classList.remove('ok')
              input.classList.add('wrong')
            })
          }
        }
      }
      else {
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
  }

  render () {
    return (
      <div className="content-wrap">
        <Toolbar smartTable={true}/>
        <h1>Решение диофантова уравнения</h1>
        <h2>Тренажёр</h2>
        {this.state.input ? 
          <div>
            <p>Решите уравение: {this.state.input[0]}x + {this.state.input[1]}y = {this.state.input[2]}</p>
            <div className="answer-area">
              НОД ({this.state.input.join(', ')}) = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.nod} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </div>
            <div className="answer-area">
              a1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.a} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
              &nbsp;b1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.b} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
              &nbsp;c1 = &nbsp;
              <div className="input-number-wrap">
                <input type="number" data-original={this.state.output.c} onBlur={e => this.check(e)}/>
                <i className="checker"></i>
              </div>
            </div>
            <p>Где a1, b1, c1 - сокращенные коэффиценты уравнения</p>
            <Table data={this.state.table.map(row => row.map(col => 
              col !== '' ? (
                <div className="input-number-wrap">
                  <input type="number" data-original={col} onBlur={e => this.check(e)}/>
                  <i className="checker"></i>
                </div>
              ) : null
            ))}/>
            <p>Ответ:</p>
            <div className="output" ref="outputWrap">
              <div className="answer-area">
                X = &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.x[0]} onBlur={e => this.check(e)} ref="a1"/>
                  <i className="checker"></i>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.x[1]} onBlur={e => this.check(e)} ref="b1"/>
                  <i className="checker"></i>
                </div>
                &nbsp;t
              </div>
              <div className="answer-area">
                Y = &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.y[0]} onBlur={e => this.check(e)} ref="a2"/>
                  <i className="checker"></i>
                </div>
                &nbsp; + &nbsp;
                <div className="input-number-wrap">
                  <input type="number" data-original={this.state.output.y[1]} onBlur={e => this.check(e)} ref="b2"/>
                  <i className="checker"></i>
                </div>
                &nbsp;t
              </div>
            </div>
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