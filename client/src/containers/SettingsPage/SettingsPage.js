import React, { Component } from 'react'
import Base from '../../components/Base/Base'
import Toggle from 'material-ui/Toggle'
import {settingsData} from '../../data'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import Settings from '../../components/Settings/Settings'
import EditCard from '../../components/Settings/EditCards'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'

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

{ /*  <Base
          title='Settings'
          navigation='Application / Settings'
      >
          <Card>
            <CardHeader
              title='Personal'
              subtitle='Email / Password'
              actAsExpander
              showExpandableButton
        />
            <CardText expandable>
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
            </CardText>
          </Card>
          <Card>
            <CardHeader
              title='School'
              subtitle='Year / Major'
              actAsExpander
              showExpandableButton
        />
            <CardText expandable>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          </Card>
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
</StyledQuestions>         </Base> */ }
