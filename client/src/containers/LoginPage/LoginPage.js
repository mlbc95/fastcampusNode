import React from 'react'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ThemeDefault from '../../ThemeDefault'
import LoginForm from '../../components/Login/LoginForm'
import axios from 'axios'

class LoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor (props) {
    super(props)

    this.processForm = this.processForm.bind(this)
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event, user) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault()
    console.log(user.userName)
    console.log(user.password)
    const formData = `userName=${user.userName}&password=${user.password}`

    // create an AJAX request
    /* eslint-disable */
    const xhr = new XMLHttpRequest() 
    xhr.open('post', '/auth/login')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        console.log('The form is valid')
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {}
        errors.summary = xhr.response.message
      }
    })
    xhr.send(formData)
    console.log(xhr)
  }
  /* eslint-enable */
  /**
   * Render the component.
   */
  render () {
    return (
      <LoginForm
        onSubmit={this.processForm}
      />
    )
  }
}

export default LoginPage
