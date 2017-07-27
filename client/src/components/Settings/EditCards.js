import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import PropTypes from 'prop-types'

const EditCard = ({
  title,
  subtitle,
  data,
  handleClick,
  edit
}) => (
  <Card>
    <CardHeader
      title={title}
      subtitle={subtitle}
      actAsExpander
      showExpandableButton
        />
    <CardText expandable>
      {data}
      <RaisedButton
        className='buttons'
        backgroundColor='#a4c639'
        label={edit ? 'Save' : 'Update'}
        primary
        onTouchTap={() => handleClick()}
    />
    </CardText>
  </Card>
)

EditCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  data: PropTypes.any.isRequired,
  handleClick: PropTypes.func
}

export default EditCard
