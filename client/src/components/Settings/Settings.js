import React from 'react'
import PropTypes from 'prop-types'

const Settings = ({
  fName,
  lName,
  school,
  gps
}) => (
  <div>
    First Name: <br /> <span> {fName} </span> <br />
    Last Name: <br /> <span> {lName} </span> <br />
    School: <br /> <span> {school} </span> <br />
  </div>
)

Settings.propTypes = {
  fName: PropTypes.string,
  lName: PropTypes.string,
  school: PropTypes.string,
  gps: PropTypes.bool
}
export default Settings
