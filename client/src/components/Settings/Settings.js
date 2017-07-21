import React from 'react'
import PropTypes from 'prop-types'

const Settings = ({
  fName,
  lName,
  school,
  gps
}) => (
  <div>
    <h1>
      {fName}
    </h1>
    <h1>
      {lName}
    </h1>
    <h1>
      {school}
    </h1>
  </div>
)

Settings.propTypes = {
  fName: PropTypes.string,
  lName: PropTypes.string,
  school: PropTypes.string,
  gps: PropTypes.bool
}
export default Settings
