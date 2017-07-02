import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import NavBar from '../../components/NavBar/NavBar'
import Sidebar from '../../components/Sidebar/Sidebar'
import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth'
import ThemeDefault from '../../ThemeDefault'
import Data from '../../data'
import { withRouter } from 'react-router'

class ControlCenter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      navDrawerOpen: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({navDrawerOpen: nextProps.width === LARGE})
    }
  }

  handleChangeRequestNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  render() {
    let { navDrawerOpen } = this.state
    const paddingSidebarOpen = 236

    const styles = {
      NavBar: {
        paddingLeft: navDrawerOpen ? paddingSidebarOpen : 0
      },
      container: {
        margin: '80px 20px 20px 15px',
        paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingSidebarOpen : 0
      }
    }

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <NavBar styles={styles.NavBar}
                  handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)}/>

          <Sidebar navDrawerOpen={navDrawerOpen}
                      menus={Data.menus}
                      username='User Admin'/>

          <div style={styles.container}>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ControlCenter.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
}

const connectedControlCenter = withWidth()(ControlCenter)

export default withRouter(connectedControlCenter)
