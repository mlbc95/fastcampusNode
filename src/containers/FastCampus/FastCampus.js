import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'

// ControlCenter components
import ControlCenter from '../ControlCenter/ControlCenter'
import NotFound from '../../components/NotFound/NotFound'
import LoginPage from '../LoginPage/LoginPage'
import SignUpPage from '../SignUpPage/SignUpPage'
import DashboardPage from '../DashboardPage/DashboardPage'
import FormPage from '../FormPage/FormPage'

const FastCampusControlCenter = () => (
  <ControlCenter>
    <Switch>
      <Route exact path='/' component={DashboardPage} />
      <Route path='/dashboard' component={DashboardPage} />
      <Route path='/form' component={FormPage} />
      <Route component={NotFound} />
    </Switch>
  </ControlCenter>
)

const FastCampus = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/' component={FastCampusControlCenter} />
    </Switch>
  </BrowserRouter>
)

export default FastCampus
