import React, { Component } from 'react'
import Base from '../../components/Base'
import {settingsData} from '../../data'
import TextField from 'material-ui/TextField'
import Settings from '../../components/Settings/Settings'
import EditCard from '../../components/Settings/EditCards'
import axios from 'axios'

class SettingsPage extends Component {
  constructor (props) {
    var token = localStorage.getItem('token')
    super(props)

    axios.get('auth/profile', {
      headers: {Authorization: token}
    }).then(function (response) {
      user = response.data.user
      console.log(user)
    }).catch(function (error) {
      console.log(error)
    })
    this.state = {
      fName: settingsData.fName,
      lName: settingsData.lName,
      school: settingsData.school,
      gps: settingsData.gps,
      edit: false
    }
  }

  handleClick () {
    this.setState({
      edit: !this.state.edit
    })
  }

  render () {
    return (
      <Base
        title='Settings'
        navigation='Application / Settings'
      >
        <div style={{paddingTop: '30px'}}>
          <EditCard
            title='Personal'
            subtitle='Email / Password'
            edit={this.state.edit}
            handleClick={() => this.handleClick()}
            data={
              this.state.edit ? (
                <div>
                  <h1>Fill the fields that are to be updated</h1>
                  <TextField
                    className='text'
                    hintText={settingsData.fName}
                    floatingLabelText='First Name'
                    floatingLabelFixed
                  /> <br />
                  <TextField
                    className='text'
                    hintText={settingsData.lName}
                    floatingLabelText='Last Name'
                    floatingLabelFixed
                  /> <br />
                  <TextField
                    className='text'
                    hintText={settingsData.school}
                    floatingLabelText='School'
                    floatingLabelFixed
                  />
                </div>

                ) : (

                  <Settings {...this.state} />
                )
              }
          />
          <EditCard title='School' subtitle='Year/Major' data='Hello' edit={this.state.edit} />
        </div>
      </Base>

    )
  }
}

export default SettingsPage
