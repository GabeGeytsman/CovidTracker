import React from 'react'
import './Header.css'
import globe from './globewhite.svg'

function Header() {
  return (
    <div className = "Header-body"> 
        <img src = {globe} className = "Globe-logo" />
        <div className = "Header-text">Ultimate Coronavirus Tracker</div>
    </div>
  )
}

export default Header
//style = {{backgroundColor: '#5900b3'}}