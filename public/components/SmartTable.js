import React, {Component} from 'react'
import Table from './Table'

export default class SmartTable extends Component {

    componentDidMount() {
        let t = []
        for (let i = 0; i < 4; i++) {
            t.push([])
            for (let j = 0; j < 10; j++) {
                t[i].push(<div className="number-wrap"></div>)
            }
        }
        t[0][0] = (
            <div className="input-number-wrap">
                <input type="number"/>
            </div>
        )
        t[0][1] = (
            <div className="input-number-wrap">
                <input type="number"/>
            </div>
        )

        this.setState({table: t})
    }

    solve (e) {
        let inputs = this.refs.st.querySelectorAll('input[type="number"]')
        let a = parseInt(inputs[0].value)
        let b = parseInt(inputs[1].value)
        if (a && b) {
            const url = 'http://discrete-eltech.eurodir.ru:8888/solve/pem?a=' + a + '&b=' + b
            fetch(url)
                .then(response => response.json())
                .then(table => {
                    let newTable = table.slice()
                    for (let i = 0; i < newTable.length; i++) {
                        for (let j = 0; j < newTable[i].length; j++) {
                            if (i == 0 && j < 2) {
                                newTable[i][j] = (
                                    <div className="input-number-wrap">
                                        <input type="number"/>
                                    </div>
                                )
                            }
                            else {
                                newTable[i][j] = (
                                    <div className="number-wrap">
                                        {newTable[i][j]}
                                    </div>
                                )
                            }
                        }
                    }
                    this.setState({table: table})
                })
                .catch(console.error)
        }
    }

    render () {
        return (
            <div className="smart-table">
                {this.state ? 
                    <div ref="st">
                        <Table data={this.state.table}/>
                        <div className="button-wrap">
                            <button onClick={e => this.solve(e)}>=</button>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
    }
}