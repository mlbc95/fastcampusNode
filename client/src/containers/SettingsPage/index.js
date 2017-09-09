import React, { Component } from 'react'
import Base from '../../components/Base'
import TextField from 'material-ui/TextField'
import {Settings, School} from '../../components/Settings/Settings'
import EditCard from '../../components/Settings/EditCards'
import axios from 'axios'

class SettingsPage extends Component {
  constructor (props) {
    var token = localStorage.getItem('token')
    super(props)
    this.state = {
      fName: 'Na',
      lName: 'NA',
      school: 'NA',
      degree: 'NA',
      year: 'NA',
      gps: false,
      edit: false
    }
    var self = this // this means something different in axios
    axios.get('user/profile', { headers: {Authorization: token}
    }).then(function (response) {
      console.log(response)
      var user = response.data.user
      self.setState({
        fName: user.fName,
        lName: user.lName,
        school: user.school
      })
    }).catch(function (error) {
      console.log(error)
    })
  }
  render () {
    const handleClick = async() => {
      if (this.state.edit) {
        axios.post('user/updateUser', this.state, { headers: {Authorization: localStorage.getItem('token')}
        }).then(function (response) {
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      }
      this.setState({
        edit: !this.state.edit
      })
    }
    const editValues = (event) => {
      switch (event.target.id) {
        case '1':
          this.setState({fName: event.target.value})
          break
        case '2':
          this.setState({lName: event.target.value})
          break
        case '3':
          this.setState({school: event.target.value})
          break
      }
    }
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
            handleClick={() => handleClick()}
            data={
              this.state.edit ? (
                <div>
                  <h1>Fill the fields that are to be updated</h1>
                  <TextField
                    className='text'
                    hintText={this.state.fName}
                    floatingLabelText='First Name'
                    floatingLabelFixed
                    id='1'
                    onChange={editValues}
                  /> <br />
                  <TextField
                    className='text'
                    hintText={this.state.lName}
                    floatingLabelText='Last Name'
                    floatingLabelFixed
                    id='2'
                    onChange={editValues}
                  /> <br />
                </div>
                ) : (
                  <Settings {...this.state} />
                )
              }
          />
          <EditCard
            title='School'
            subtitle='Year/Major'
            edit={this.state.edit}
            handleClick={() => handleClick()}
            data={this.state.edit ? (
              <div>
                <h1>Fill the fields that are to be updated</h1>
                <TextField
                  className='text'
                  hintText={this.state.school}
                  floatingLabelText='School'
                  floatingLabelFixed
                  id='3'
                  onChange={editValues}
                  /> <br />
                <TextField
                  className='text'
                  hintText={this.state.degree}
                  floatingLabelText='Degree'
                  floatingLabelFixed
                  id='4'
                  onChange={editValues}
                  /> <br />
                <TextField
                  className='text'
                  hintText={this.state.year}
                  floatingLabelText='Year'
                  floatingLabelFixed
                  id='5'
                  onChange={editValues}
                  />
              </div>
                ) : (
                  <School {...this.state} />
                )
              }
          />
        </div>
      </Base>

    )
  }
}

export default SettingsPage
