import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <div className='container'>
    <form action='/' onSubmit={onSubmit}>

      <div className='field-line'>
        <TextField
          floatingLabelText='First Name'
          name='fName'
          errorText={errors.fName}
          onChange={onChange}
          value={user.fName}
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='Last Name'
          name='lName'
          errorText={errors.lName}
          onChange={onChange}
          value={user.lName}
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='Username'
          name='userName'
          onChange={onChange}
          errorText={errors.userName}
          value={user.userName}
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='Email'
          name='email'
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='Password'
          type='password'
          name='password'
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>
      <div className='field-line'>
        <TextField
          floatingLabelText='School'
          name='school'
          onChange={onChange}
          errorText={errors.school}
          value={user.school}
        />
      </div>

      <div className='button-line'>
        <RaisedButton type='submit' label='Create New Account' primary />
      </div>

      <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
    </form>
  </div>
)

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default SignUpForm
