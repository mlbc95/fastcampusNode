import React from 'react'
import ReactDOM from 'react-dom'
import FastCampusContainer from './containers/FastCampusContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'
import './css/index.css'

const App = () => (
  <MuiThemeProvider>
    <FastCampusContainer />
  </MuiThemeProvider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

registerServiceWorker()

if (module.hot) {
  module.hot.accept()
}