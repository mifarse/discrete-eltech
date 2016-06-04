import React, { Component } from 'react'
import { Link } from 'react-router'
import Table from './Table'

export default class Student extends Component {
  
  constructor (props) {
    super(props)
    
    fetch('http://88.201.187.23:8888/s/' + this.props.params.studentID + '/info')
      .then(response => response.json())
      .then(student => {
        this.setState({
          ...this.state,
          student : student,
        })
      })
      .catch(console.error)

    fetch('http://88.201.187.23:8888/s/' + this.props.params.studentID + '/tests')
      .then(response => response.json())
      .then(tests => {
        this.setState({
          ...this.state,
          tests : tests,
        })
      })
      .catch(console.error)
  }

  render () {
    return (
      <div id="student-page" className="content-wrap">
        {this.state && 'student' in this.state ? 
          <div>
            <div className="user">
              <img src={this.state.student.photo} className="photo"/>
              <div className="info">
                <div className="name field">{this.state.student.first_name} {this.state.student.last_name}</div>
                <div className="group field">
                  Группа
                  &nbsp;<Link to={'/group/' + this.state.student.group}>{this.state.student.group}</Link>
                </div>
                <div className="email field">
                  <a href={'mailto:' + this.state.student.email}>{this.state.student.email}</a>
                </div>
              </div>
            </div>
            <div className="tests">
              {'tests' in this.state ? 
                this.state.tests.count > 0 ? 
                  <div>
                    <h2>Тесты</h2>
                    <ul>
                      {this.state.tests.tests.map(test => {
                      return (<li className="student" key={test._id}>
                        {test.finished ? 
                          <div className="test">
                            <span>{test.testName} - пройден - время {Math.floor(test.duration / 60)}мин {Math.floor(test.duration) % 60}с</span>
                            <h3>Решение студента</h3>
                            <h4>Входные данные</h4>
                            <div>{test.object.input.join(', ')}</div>
                            <h4>Таблица</h4>
                            <Table data={test.object.table.map(row => row.map(col => 
                              <div className="number-wrap">{col}</div>
                            ))}/>
                            <h4>Ответ</h4>
                            <div>{test.object.output}</div>
                          </div>
                        : null}
                      </li>)
                      })}
                    </ul>
                  </div>
                : <h2>Нет решенных тестов</h2>
              : null}
            </div>
          </div>
        : null}
      </div>
    )
  }
}
