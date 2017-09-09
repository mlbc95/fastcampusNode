import React from 'react'
import PropTypes from 'prop-types'

export const Settings = ({
  fName,
  lName,
  school,
  gps
}) => (
  <div>
    First Name: <br /> <span> {fName} </span> <br />
    Last Name: <br /> <span> {lName} </span> <br />
  </div>
)

export const School = ({
  school,
  degree,
  year
  }) => (
    <div>
      School: <br /> <span> {school} </span> <br />
      Degree: <br /> <span> {degree} </span> <br />
      Year: <br /> <span> {year} </span> <br />
    </div>
)

Settings.propTypes = {
  fName: PropTypes.string,
  lName: PropTypes.string,
  school: PropTypes.string,
  gps: PropTypes.bool
}

School.protoTypes = {
  school: PropTypes.string,
  degree: PropTypes.string,
  year: PropTypes.string
}
