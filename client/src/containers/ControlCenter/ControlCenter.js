import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../../components/NavBar/NavBar'
import Sidebar from '../../components/Sidebar/Sidebar'
import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth'
import Data from '../../data'

class ControlCenter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      navDrawerOpen: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ navDrawerOpen: nextProps.width === LARGE })
    }
  }

  handleChangeRequestNavDrawer () {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  render () {
    const { navDrawerOpen } = this.state
    const paddingSidebarOpen = 236

    const styles = {
      NavBar: {
        paddingLeft: navDrawerOpen ? paddingSidebarOpen : 0
      },
      container: {
        margin: '20px 20px 20px 20px',
        paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingSidebarOpen : 0
      }
    }

    return (
      <div>
        <NavBar
          styles={styles.NavBar}
          handleChangeRequestNavDrawer={() => this.handleChangeRequestNavDrawer()}
        />

        <Sidebar
          navDrawerOpen={navDrawerOpen}
          menus={Data.menus}
          username='User Admin'
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
