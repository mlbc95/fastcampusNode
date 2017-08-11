import React from 'react'
import axios from 'axios'
import SignUpForm from '../../components/Signup/SignupForm'
import Base from '../../components/Base/Base'

class SignUpPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor (props) {
    super(props)

    // set the initial component state
    this.state = {
      errors: {},
      error: '',
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
    const self = this

    axios.post('auth/signup', {
      fName: this.state.user.fName,
      lName: this.state.user.lName,
      username: this.state.user.userName,
      email: this.state.user.email,
      password: this.state.user.password,
      school: this.state.user.school

    })
      .then(function (response) {
        if (!response.data.success) {
          self.setState({ error: response.data.msg })
        } else {
          window.location = '/login'
        }
        return response
      })
    .catch(function (error) {
      self.setState({error})
    })
  }

  /**
   * Render the component.
   */
  render () {
    return (
      <Base title='Sign Up'>
        <div>
          {this.state.error && <p className='error-message'>{this.state.error}</p>}
          <SignUpForm
            onSubmit={this.processForm}
            onChange={this.changeUser}
            errors={this.state.errors}
            user={this.state.user}
          />
        </div>
      </Base>
    )
  }
}

export default SignUpPage
