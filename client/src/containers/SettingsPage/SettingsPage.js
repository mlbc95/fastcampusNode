import React, { Component } from 'react'
import Base from '../../components/Base/Base'
import Toggle from 'material-ui/Toggle'
import {settingsData} from '../../data'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

const styles = {
  padding: {
    padding: '5px 5px 5px 5px'
  },
  separators: {
    padding: '0px 0px 0px 10px'
  },
  toggle: {
    marginBottom: 16,
    width: '50%',
    margin: '0 0 0 25%'
  },
  textFieldStyle: {
    margin: '5px 17.5% 2% 25%',
    width: '25%'
  },
  buttonStyle: {
    margin: '50px 0 2% 25%',
    width: '50%'
  },
  editButtonStyle: {
    margin: '0 0 0 0',
    position: 'relative',
    width: 'auto'
  }
}

class SettingsPage extends Component {
  render () {
    return (
      <Base title='Settings'
        navigation='Application / Settings'>
        <div>
          <h1 style={styles.textFieldStyle}>Change your settings
                        by filling the corresponding field and click on Edit</h1>
          <TextField
            style={styles.textFieldStyle}
            hintText={settingsData.fName}
            floatingLabelText='First Name'
            floatingLabelFixed
                    />
          <RaisedButton
            style={styles.editButtonStyle}
                        // backgroundColor='#a4c639'
            label='Edit'
                    />
          <TextField
            style={styles.textFieldStyle}
            hintText={settingsData.lName}
            floatingLabelText='Last Name'
            floatingLabelFixed
                    />
          <RaisedButton
            style={styles.editButtonStyle}
                        // backgroundColor='#a4c639'
            label='Edit'
                    />
          <TextField
            style={styles.textFieldStyle}
            hintText={settingsData.school}
            floatingLabelText='School'
            floatingLabelFixed
                    />
          <RaisedButton
            style={styles.editButtonStyle}
                       // backgroundColor='#a4c639'
            label='Edit'
                    />
          <Toggle
            label='Share Location'
            style={styles.toggle}
            toggled={settingsData.gps}
            onToggle={
                        (event) => {
                          alert('yeah, I get it...you pressed on the toggle that by default is ' + settingsData.gps)
                        }
                    }
                    />
          <RaisedButton
            style={styles.buttonStyle}
            backgroundColor='#a4c639'
            label='Apply'
                    />
        </div>
      </Base>

    )
  }
}

export default SettingsPage
