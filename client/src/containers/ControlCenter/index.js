import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../../components/NavBar'
import Sidebar from '../../components/Sidebar'
import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth'
import Data from '../../data'
import authHelper from '../../modules/authHelper'
import axios from 'axios'

class ControlCenter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      navDrawerOpen: false,
      user: {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ navDrawerOpen: nextProps.width === LARGE })
    }
  }

  handleChangeRequestNavDrawer () {
    this.getProfile() // gets the username before opening the drawer
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  getProfile () {
    axios.get('/users/profile', {headers: {Authorization: authHelper.getToken()}})
    .then((response) => {
      this.setState({user: response.data.user})
    })
    .catch((error) => console.log(error))
    // console.log(this.state)
  }

  doLogout () {
    authHelper.deauthenticateUser()
    window.location.reload()
  }

  render () {
    const paddingSidebarOpen = 236

    const styles = {
      NavBar: {
        paddingLeft: this.state.navDrawerOpen ? paddingSidebarOpen : 0
      },
      container: {
        margin: '20px 20px 20px 20px',
        paddingLeft: this.state.navDrawerOpen && this.props.width !== SMALL ? paddingSidebarOpen : 0
      }
    }

    return (
      <div>
        <NavBar
          styles={styles.NavBar}
          handleChangeRequestNavDrawer={() => this.handleChangeRequestNavDrawer()}
          doLogout={() => this.doLogout()}

        />

        <Sidebar
          navDrawerOpen={this.state.navDrawerOpen}
          menus={Data.menus}
          {...this.state.user}
        />

        <div style={styles.container}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

ControlCenter.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
}

export default withWidth()(ControlCenter)
