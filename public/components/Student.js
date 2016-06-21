import React, { Component } from 'react'
import { Link } from 'react-router'
import Table from './Table'

export default class Student extends Component {
  
  constructor (props) {
    super(props)
    
    this.loadStudentInfo(props)
  }

  loadStudentInfo (props) {
    fetch('http://discrete-eltech.eurodir.ru:8888/s/' + props.params.studentID + '/info')
      .then(response => response.json())
      .then(student => {
        this.setState({
          ...this.state,
          student : student,
        })
      })

    fetch('http://discrete-eltech.eurodir.ru:8888/s/' + props.params.studentID + '/tests')
      .then(response => response.json())
      .then(tests => {
        console.log({
          ...this.state,
          tests : tests,
        })
        this.setState({
          ...this.state,
          tests : tests,
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    this.loadStudentInfo(nextProps)
  }

  render () {
    return (
      <div id="student-page" className="content-wrap">
        {this.state && 'student' in this.state ? 
          <div>
            <div className="user" key={this.state.student._id}>
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
                {this.state.student.website ?
                  <div className="website field">
                    <a href={this.state.student.website} target="_blank">Google сайт</a>
                  </div>
                  : null
                }
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
                            {test.object.table ?
                              <div> 
                                <h4>Таблица</h4>
                                <Table data={test.object.table.map(row => row.map(col => 
                                  <div className="number-wrap">{col}</div>
                                ))}/>
                              </div>
                              : null
                            }
                            <h4>Ответ</h4>
                            <div>{JSON.stringify(test.object.output)}</div>
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
