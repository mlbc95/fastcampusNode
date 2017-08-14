import React from 'react'
import md5 from 'md5'
import PropTypes from 'prop-types'
import StyledAvatar from './StyledAvatar'

const createDefaultAvatar = (firstName, lastName) => {
  if (!firstName || !lastName) return 'NA'
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
}

const getGravatar = (email, size) => {
  const s = size || 60

  return `https://www.gravatar.com/avatar/${md5(email)}.jpg?s=${s}&d=blank`
}

const Avatar = ({
  url,
  email,
  firstName,
  lastName,
  size
}) => (
  <StyledAvatar bg={!!(!url && firstName && lastName)} size={size || 30}>
    <span>{createDefaultAvatar(firstName, lastName)}</span>
    <img src={url || getGravatar(email || 'none')} alt={firstName + ' ' + lastName} />
  </StyledAvatar>
  )

Avatar.propTypes = {
  url: PropTypes.string,
  email: PropTypes.string,
  size: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string
}

export default Avatar
