import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class MainNavigation extends Component {
  render () {
    return (
      <nav className='main-navigation'>
        <ul ref='spoilers'>
          {this.props.items.map(item => 
            <li className='spoiler' onClick={e => this.toggleSpoiler(e)} key={item.url.substring(1)}>
              <div className='title'>{item.title}</div>
              <ul className='content'>
                <li><Link to={item.url + '/show'}>Демонстрация</Link></li>
                <li><Link to={item.url + '/trainer'}>Тренажер</Link></li>
                <li><Link to={item.url + '/test'}>Контроль</Link></li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    )
  }

  toggleSpoiler (event) {
    let spoilers = this.refs.spoilers.querySelectorAll('.spoiler')
    for (let i = 0; i < spoilers.length; i++) {
      if (spoilers[i] !== event.currentTarget) {
        spoilers[i].classList.remove('active')
      }
    }
    event.currentTarget.classList.toggle('active')
  }
}

MainNavigation.propTypes = {
  items: PropTypes.array.isRequired
}
