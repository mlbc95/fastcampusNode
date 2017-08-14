import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/svg-icons/navigation/menu'
import FlatButton from 'material-ui/FlatButton'
import { white } from 'material-ui/styles/colors'

class NavBar extends Component {
  render () {
    const {styles, handleChangeRequestNavDrawer, doLogout} = this.props

    return (
      <div>
        <AppBar
          style={{...styles}}
          iconElementLeft={
            <IconButton style={{marginLeft: 20}} onClick={handleChangeRequestNavDrawer}>
              <Menu color={white} />
            </IconButton>
          }
          iconElementRight={<FlatButton label='Logout' onTouchTap={doLogout} />}
        />
      </div>
    )
  }
}

NavBar.propTypes = {
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func,
  doLogout: PropTypes.func
}

export default NavBar
