import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'

// ControlCenter components
import ControlCenter from '../ControlCenter'
import NotFound from '../NotFound'
import LoginPage from '../LoginPage'
import SignUpPage from '../SignUpPage'
import DashboardPage from '../DashboardPage'
import FormPage from '../FormPage'
import ProfilePage from '../ProfilePage'
import SchoolPage from '../SchoolPage'
import MessagePage from '../MessagePage'
import AcademicsPage from '../AcademicsPage'
import SettingsPage from '../SettingsPage'
import RequiredAuth, { NoAuth } from '../../hocs/withAuth'

const FastCampusControlCenter = () => (
  <ControlCenter>
    <Switch>
      <Route exact path='/' component={DashboardPage} />
      <Route path='/dashboard' component={DashboardPage} />
      <Route path='/profile' component={ProfilePage} />
      <Route path='/school' component={SchoolPage} />
      <Route path='/messages' component={MessagePage} />
      <Route path='/academics' component={AcademicsPage} />
      <Route path='/settings' component={SettingsPage} />
      <Route path='/form' component={FormPage} />
      <Route component={NotFound} />
    </Switch>
  </ControlCenter>
)

const FastCampus = () => (
  <BrowserRouter>
    <Switch>
      <NoAuth path='/login' component={LoginPage} />
      <NoAuth path='/signup' component={SignUpPage} />
      <RequiredAuth path='/' component={FastCampusControlCenter} />
    </Switch>
  </BrowserRouter>
)

export default FastCampus
