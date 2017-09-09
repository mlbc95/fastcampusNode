import React from 'react'

const tempStyle1 = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  backgroundcolor: '#000000'
}
const tempStyle2 = {
  position: 'absolute',
  left: '25%',
  right: '25%',
  top: '25%',
  bottom: '25%',
  margin: 'auto',
  background: 'white'
}
class Tutorial extends React.Component {
  render () {
    return (
      <div style={tempStyle1}>
        <div style={tempStyle2}>
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    )
  }
}

export default Tutorial
