import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'

// App components
import App from '../App/App'
import NotFound from '../../components/NotFound/NotFound'
import LoginPage from '../LoginPage/LoginPage'
import SignUpPage from '../SignUpPage/SignUpPage'
import DashboardPage from '../DashboardPage/DashboardPage'
import FormPage from '../FormPage/FormPage'

const FastCampusApp = () => (
  <div>
    <App />
    <Route path='/dashboard' component={DashboardPage} />
    <Route path='/form' component={FormPage} />
  </div>
)

const FastCampus = () => (
  <BrowserRouter>
    <div style={{ height: '100%' }}>
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/signup' component={SignUpPage} />
        <Route path='/' component={FastCampusApp} />
      </Switch>
    </div>
  </BrowserRouter>
)

export default FastCampus
