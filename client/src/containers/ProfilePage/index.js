import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { profilePageData } from '../../data'
import Base from '../../components/Base'

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {...profilePageData}
  }

  fullName () {
    return this.state.fName + ' ' + this.state.lName
  }

  render () {
    return (
      <Base title={`${this.fullName()}'s Profile`}>
        <Card>
          <CardMedia
            overlay={
              <CardHeader
                title={this.fullName()}
                subtitle={this.state.username}
                avatar='http://www.material-ui.com/images/uxceo-128.jpg'
              />}
            mediaStyle={{height: '30%', maxHeight: '500px', overflow: 'hidden'}}
          >
            <img style={{height: '100%', width: '100%'}}
              src='http://blogs.umsl.edu/news/files/2015/09/msc_ponds_818.jpg'
              alt={`${this.state.username}'s background`}
            />
          </CardMedia>
          <CardTitle title='Card title' subtitle='Card subtitle' />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions>
            <FlatButton label='Action1' />
            <FlatButton label='Action2' />
          </CardActions>
        </Card>
      </Base>
    )
  }
}

export default ProfilePage
