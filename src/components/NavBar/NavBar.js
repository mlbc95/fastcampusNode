import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => (
  <nav>
    <ul>
      <li><NavLink exact to="/">Home</NavLink></li>
    </ul>    
  </nav>
);

export default NavBar