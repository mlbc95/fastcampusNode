import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'

// App components
import NavBar from '../../components/NavBar/NavBar'
import Home from '../../components/Home/Home'
import Base from '../../components/Base/Base'
import NotFound from '../../components/NotFound/NotFound'
import LoginPage from '../LoginPage/LoginPage'
import SignUpPage from '../SignUpPage/SignUpPage'

const FastCampusContainer = () => (
  <BrowserRouter>
    <div style={{ height: '100%' }}>
      <NavBar />
      <Base />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={LoginPage} />
        <Route path='/signup' component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
)

export default FastCampusContainer




