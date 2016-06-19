import React from 'react'
import { Link } from 'react-router'

function getCookie (name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default function Header () {
  const studentID = getCookie('student_id');
  return (
    <header id="header">
      <nav className="menu">
        <ul>
          <li><Link to="/"><img src="/images/leti.png" className="logo" alt="ЛЭТИ" title="Home" /></Link></li>
          <li><Link to="/about">О проекте</Link></li>
          <li><Link to="/group">Список групп</Link></li>
          <li>
            <a href="http://discrete-eltech.eurodir.ru:8888/generatedoc" target="_blank">
              Отчет
            </a>
          </li>
        </ul>
        {studentID ? 
          <Link to={'/student/' + studentID} className="button">Личный кабинет</Link> : 
          <a href="/auth/google" className="button">Войти через Google</a>}
      </nav>
    </header>
  )
}