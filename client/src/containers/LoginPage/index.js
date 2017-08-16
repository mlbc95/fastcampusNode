import React from 'react'
import LoginForm from '../../components/LoginForm'
import Base from '../../components/Base'
import axios from 'axios'
import authHelper from '../../modules/authHelper'

class LoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor (props) {
    super(props)
    this.processForm = this.processForm.bind(this)

    this.state = {
      error: ''
    }
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
    // create a string for an HTTP body message

    axios.post('/auth/login', {
      userName: user.userName,
      password: user.password
    }, {headers: {Accept: 'application/json'}})
    .then((response) => { // response is a javascript object
      console.log(response)
      if (!response.data.success) { // if success comes as false then the user does not log in
        // ERROR ON THE PAGE HERE
        this.setState({
          error: 'Invalid credentials'
        })
        console.log(response.data.msg)
      } else {
        console.log(response.data.token)
        authHelper.authenticateUser(response.data.token) // modules -> authHelper
        window.location.reload()
      }

      // authHelper.isUserAuthenticated ? this.redirecTo('/') : this.redirecTo('/')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  /**
   * Render the component.
   */
  render () {
    return (
      <Base title='Login'>
        <div>
          {this.state.error && <p className='error-message'>{this.state.error}</p>}
          <LoginForm
            onSubmit={this.processForm}
          />
        </div>
      </Base>
    )
  }
}

export default LoginPage
