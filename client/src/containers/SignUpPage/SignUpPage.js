import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ThemeDefault from '../../ThemeDefault'
import SignUpForm from '../../components/Signup/SignupForm'

class SignUpPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor (props) {
    super(props)

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        fName: '',
        lName: '',
        userName: '',
        password: '',
        school: ''
      }
    }

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser (event) {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value

    this.setState({
      user
    })
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault()
    axios.get('auth/signup')
      .then(function (response) {
        console.log(response)
      })
  .catch(function (error) {
    console.log(error)
  })
    console.log('fName:', this.state.user.fName)
    console.log('lName:', this.state.user.lName)
    console.log('email:', this.state.user.email)
    console.log('password:', this.state.user.password)
    console.log('userName:', this.state.userName)
    console.log('school:', this.state.user.school)
  }

  /**
   * Render the component.
   */
  render () {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    )
  }
}

export default SignUpPage
