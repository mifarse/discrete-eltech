import React, {Component} from 'react'

export default class Secret extends Component {

    showSecret (e) {
        e.target.closest('.secret').classList.add('active')
    }

    render () {
        return (
            <div className="secret">
                <div className="title" onClick={e => {this.showSecret(e)}}>{this.props.title}</div>
                <div className="content">{this.props.content}</div>
            </div>
        )
    }
}