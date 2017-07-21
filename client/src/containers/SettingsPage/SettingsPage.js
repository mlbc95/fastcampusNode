import React, { Component } from 'react'
import Base from '../../components/Base/Base'
import Toggle from 'material-ui/Toggle'
import {settingsData} from '../../data'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import Settings from '../../components/Settings/Settings'

const StyledQuestions = styled.div`
  .text {
    margin: 5px 17.5% 2% 25%;
  }

  .toggle {
    width: 2%;
    margin: 0 0 0 0%;
  }

  .edit {
    margin: 0;
    position: relative;
    width: auto;
  }

  .buttons {
    margin: 50px 0 0 25%;
    width: 50%;
  }
`

class SettingsPage extends Component {
  constructor (props) {
    super(props)
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
        {
          this.state.edit ? (
            <h1>Edit</h1>
          ) : (
            <Settings {...this.state} />
          )
        }
        <RaisedButton
          className='buttons'
          backgroundColor='#a4c639'
          label='Update'
          primary
          onClick={() => this.handleClick()}
        />
        {/* <StyledQuestions>
          <h1 className='text'>
            Change your settings by filling the corresponding field and click on Edit
          </h1>
          {
            this.state.edit ? (
              <h1>
                {this.state.fName}
                {this.state.lName}
                {this.state.school}
              </h1>
            ) : (
              <TextField
                className='text'
                hintText={settingsData.fName}
                floatingLabelText='First Name'
                floatingLabelFixed
              />
            )
          }
          <TextField
            className='text'
            hintText={settingsData.lName}
            floatingLabelText='Last Name'
            floatingLabelFixed
                    />
          <TextField
            className='text'
            hintText={settingsData.school}
            floatingLabelText='School'
            floatingLabelFixed
                    />
          <Toggle
            label='Share Location'
            className='toggle'
            toggled={settingsData.gps}
            onToggle={
              (event) => {
                alert('yeah, I get it...you pressed on the toggle that by default is ' + settingsData.gps)
              }
            }
          />
          <RaisedButton
            className='buttons'
            backgroundColor='#a4c639'
            label='Update'
            primary
                    />
          <RaisedButton
            className='buttons'
            backgroundColor='#a4c639'
            label='Apply'
                    />
        </StyledQuestions> */}
      </Base>

    )
  }
}

export default SettingsPage
