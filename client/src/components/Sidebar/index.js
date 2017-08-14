import React from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'
import { spacing, typography } from 'material-ui/styles'
import { white, blue600 } from 'material-ui/styles/colors'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar'
import AvatarWrapper from './AvatarWrapper'

const Sidebar = ({
  navDrawerOpen,
  email,
  fName,
  lName,
  menus
}) => {
  const styles = {
    logo: {
      cursor: 'pointer',
      fontSize: 22,
      color: typography.textFullWhite,
      lineHeight: `${spacing.desktopKeylineIncrement}px`,
      fontWeight: typography.fontWeightLight,
      backgroundColor: blue600,
      paddingLeft: 40,
      height: 56
    },
    menuItem: {
      color: white,
      fontSize: 14
    },
    avatar: {
      div: {
        padding: '15px 0 20px 15px',
        backgroundImage: 'url(' + require('../../images/material_bg.png') + ')',
        height: 45
      },
      icon: {
        float: 'left',
        display: 'block',
        marginRight: 15,
        boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
      },
      span: {
        paddingTop: 12,
        display: 'block',
        color: 'white',
        fontWeight: 300,
        textShadow: '1px 1px #444'
      }
    }
  }

  return (
    <Drawer
      docked
      open={navDrawerOpen}
    >
      <div style={styles.logo}>
        FastCampus
      </div>
      <AvatarWrapper>
        <Avatar
          email={email}
          firstName={fName}
          lastName={lName}
          size={50}
          style={styles.avatar.icon} />
        <span style={styles.avatar.span}>{fName + ' ' + lName}</span>
      </AvatarWrapper>
      <div>
        {menus.map((menu, index) =>
          <MenuItem
            key={index}
            style={styles.menuItem}
            primaryText={menu.text}
            leftIcon={menu.icon}
            containerElement={<Link to={menu.link} />}
            />
          )}
      </div>
    </Drawer>
  )
}

Sidebar.propTypes = {
  navDrawerOpen: PropTypes.bool,
  menus: PropTypes.array,
  fName: PropTypes.string,
  lName: PropTypes.string,
  email: PropTypes.string
}

export default Sidebar
