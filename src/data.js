import React from 'react'
import Assessment from 'material-ui/svg-icons/action/assessment'
import GridOn from 'material-ui/svg-icons/image/grid-on'
import Account_circle from 'material-ui/svg-icons/action/account-circle'
import School from 'material-ui/svg-icons/social/school'
import Message from 'material-ui/svg-icons/action/announcement'
import Academics from 'material-ui/svg-icons/action/account-balance'
import Finantial from 'material-ui/svg-icons/action/account-balance-wallet'
import Settings from 'material-ui/svg-icons/action/settings'
import PermIdentity from 'material-ui/svg-icons/action/perm-identity'
import Web from 'material-ui/svg-icons/av/web'

const data = {
  menus: [
    { text: 'DashBoard', icon: <Assessment />, link: '/dashboard' },
    { text: 'Profile', icon: <Account_circle />, link: '/profile'},
    { text: 'UMSL', icon: <School />, link: '/school'},
    { text: 'Messages', icon: <Message />, link: '/messages'},
    { text: 'Academics', icon: <Academics />, link: '/academics'},
    { text: 'Finantial', icon: <Finantial />, link: '/finantial'},
    { text: 'Settings', icon: <Settings />, link: '/settings'},
    { text: 'Form Page', icon: <Web />, link: '/form' },
    { text: 'Table Page', icon: <GridOn />, link: '/table' },
    { text: 'Login Page', icon: <PermIdentity />, link: '/login' }
  ]
}

export const profilePageData = {
  fName: 'Andres',
  lName: 'Rodriguez',
  email: 'test@email.com',
  username: 'arodriguez',
  school: 'UMSL',
  avatar: 'http://www.material-ui.com/images/uxceo-128.jpg'
}

export default data
