import React from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'
import { Link } from 'react-router-dom'
import AvatarWrapper from './AvatarWrapper'
import SidebarHeader from './SidebarHeader'
import SidebarAvatar from './SidebarAvatar'
import MenuItem from './MenuItem'
import Name from './Name'

const Sidebar = ({
  navDrawerOpen,
  email,
  fName,
  lName,
  menus
}) => {
  return (
    <Drawer
      docked
      open={navDrawerOpen}
    >
      <SidebarHeader>
        FastCampus
      </SidebarHeader>
      <AvatarWrapper>
        <SidebarAvatar
          email={email}
          firstName={fName}
          lastName={lName}
          size={50}
        />
        <Name>{fName + ' ' + lName}</Name>
      </AvatarWrapper>
      <div>
        {menus.map((menu, index) =>
          <MenuItem
            key={index}
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
