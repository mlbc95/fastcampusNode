/* eslint-disable*/
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

export const events = [
  {
    title: 'All Day Event',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1)
  },
  {
    title: 'Long Event',
    start: new Date(2015, 3, 7),
    end: new Date(2015, 3, 10)
  },

  {
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0)
  },

  {
    title: 'DTS ENDS',
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0)
  },

  {
    title: 'Some Event',
    start: new Date(2015, 3, 9, 0, 0, 0),
    end: new Date(2015, 3, 9, 0, 0, 0)
  },
  {
    title: 'Conference',
    start: new Date(2015, 3, 11),
    end: new Date(2015, 3, 13),
    desc: 'Big conference for important people'
  },
  {
    title: 'Meeting',
    start: new Date(2015, 3, 12, 10, 30, 0, 0),
    end: new Date(2015, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting'
  },
  {
    title: 'Lunch',
    start: new Date(2015, 3, 12, 12, 0, 0, 0),
    end: new Date(2015, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch'
  },
  {
    title: 'Meeting',
    start: new Date(2015, 3, 12, 14, 0, 0, 0),
    end: new Date(2015, 3, 12, 15, 0, 0, 0)
  },
  {
    title: 'Happy Hour',
    start: new Date(2015, 3, 12, 17, 0, 0, 0),
    end: new Date(2015, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day'
  },
  {
    title: 'Dinner',
    start: new Date(2015, 3, 12, 20, 0, 0, 0),
    end: new Date(2015, 3, 12, 21, 0, 0, 0)
  },
  {
    title: 'Birthday Party',
    start: new Date(2015, 3, 13, 7, 0, 0),
    end: new Date(2015, 3, 13, 10, 30, 0)
  }
]

export const profilePageData = {
  fName: 'Andres',
  lName: 'Rodriguez',
  email: 'test@email.com',
  username: 'arodriguez',
  school: 'UMSL',
  avatar: 'http://www.material-ui.com/images/uxceo-128.jpg'
}

export const settingsData = {
  fName: 'Boris',
  lName: 'Pallares',
  email: 'borispallares@hotmail.com',
  school: 'Lindenwood',
  gps: true
}

export default data
