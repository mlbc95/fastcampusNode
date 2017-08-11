import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class LoginForm extends Component {
  constructor () {
    super()
    // set the initial component state
    this.state = {
      errors: {},
      user: {
        userName: '',
        password: '',
        loginStatus: false
      }
    }
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  handleChange (event) {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value

    this.setState({
      user
    })
  }

  render () {
    return (
      <div
        className='container'>
        <form action='/' onSubmit={(event) => this.props.onSubmit(event, this.state.user)}>

          <div className='field-line'>
            <TextField
              floatingLabelText='Username'
              type='text'
              name='userName'
              errorText={this.state.errors.userName}
              onChange={(e) => this.handleChange(e)}
              value={this.state.user.userName}
            />
          </div>

          <div className='field-line'>
            <TextField
              floatingLabelText='Password'
              type='password'
              name='password'
              onChange={e => this.handleChange(e)}
              errorText={this.state.errors.password}
              value={this.state.user.password}
            />
          </div>

          <div className='button-line'>
            <RaisedButton type='submit' label='Log in' primary />
          </div>

          <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
        </form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm
