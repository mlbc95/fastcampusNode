import React from 'react'
import Auth from '../modules/authHelper'
import {
  Route,
  Redirect
} from 'react-router-dom'

const RequiredAuth = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect to='/login' />
    )
  )} />
)

export default RequiredAuth
