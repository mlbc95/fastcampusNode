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
import ProfilePage from '../ProfilePage/ProfilePage'
import SchoolPage from '../SchoolPage/SchoolPage'
import MessagePage from '../MessagePage/MessagePage'
import AcademicsPage from '../AcademicsPage/AcademicsPage'
import SettingsPage from '../SettingsPage/SettingsPage'

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
      <Route path='/login' component={LoginPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/' component={FastCampusControlCenter} />
    </Switch>
  </BrowserRouter>
)

export default FastCampus
