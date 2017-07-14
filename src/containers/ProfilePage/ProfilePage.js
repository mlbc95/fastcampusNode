import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

class ProfilePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fName: 'Andres',
      lName: 'Rodriguez',
      email: 'test@email.com',
      username: 'arodriguez',
      school: 'UMSL',
      avatar: 'http://www.material-ui.com/images/uxceo-128.jpg'
    }
  }

  fullName() {
    return this.state.fName + ' ' + this.state.lName
  }

  render () {
    return (
      <Card>
        <CardMedia
          overlay={<CardHeader title={this.fullName()} 
                               subtitle={this.state.username} 
                               avatar='http://www.material-ui.com/images/uxceo-128.jpg'
                   />}
          mediaStyle={{height: '30%', maxHeight: '500px', overflow: 'hidden'}}
        >
          <img style={{height: '100%', width: '100%'}} 
               src='http://blogs.umsl.edu/news/files/2015/09/msc_ponds_818.jpg' 
               alt='' 
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
    )
  }
}

export default ProfilePage