import React, { Component } from 'react'
import Base from '../../components/Base/Base'
import Toggle from 'material-ui/Toggle'
import {settingsData} from '../../data'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'

const StyledQuestions = styled.div`
  .text {
    margin: 5px 17.5% 2% 25%;
    width: 25%;
  }

  .toggle {
    margin-bottom: 16;
    width: 50%;
    margin: 0 0 0 25%;
  }

  .edit {
    margin: 0;
    position: relative;
    width: auto;
  }

  apply {
    margin: 50px 0 2% 25%;
    width: 50%;
  }
`

class SettingsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: settingsData.fName,
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
      <Base title='Settings'
        navigation='Application / Settings'>
        <StyledQuestions>
          <h1 className='text'>
            Change your settings by filling the corresponding field and click on Edit
          </h1>

          {
            this.state.edit ? (
              <h1>{this.state.name}</h1>
            ) : (
              <TextField
                className='text'
                hintText={settingsData.fName}
                floatingLabelText='First Name'
                floatingLabelFixed
              />
            )
          }
          <RaisedButton
            className='edit'
            // backgroundColor='#a4c639'
            label='Edit'
            onClick={() => this.handleClick()}
          />
          <TextField
            className='text'
            hintText={settingsData.lName}
            floatingLabelText='Last Name'
            floatingLabelFixed
                    />
          <RaisedButton
            className='edit'
                        // backgroundColor='#a4c639'
            label='Edit'
                    />
          <TextField
            className='text'
            hintText={settingsData.school}
            floatingLabelText='School'
            floatingLabelFixed
                    />
          <RaisedButton
            className='edit'
                       // backgroundColor='#a4c639'
            label='Edit'
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
            className='apply'
            backgroundColor='#a4c639'
            label='Apply'
                    />
        </StyledQuestions>
      </Base>

    )
  }
}

export default SettingsPage
