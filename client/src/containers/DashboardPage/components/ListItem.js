import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from '../../../components/Avatar'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 20px;
  &:hover {
    background: #fafafa;
    cursor: pointer;
  }
`

const ListItem = ({primaryText, leftAvatar}) => (
  <Wrapper>
    <Avatar {...leftAvatar} />
    <span style={{ alignSelf: 'center', fontSize: '20px' }}>{primaryText}</span>
    <CommunicationChatBubble style={{alignSelf: 'center'}} />
  </Wrapper>
)

ListItem.propTypes = {
  primaryText: PropTypes.string,
  leftAvatar: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string
  })
}

export default ListItem
