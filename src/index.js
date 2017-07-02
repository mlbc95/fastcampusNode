import React from 'react'
import ReactDOM from 'react-dom'
import FastCampus from './containers/FastCampus/FastCampus'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'
import themeDefault from './ThemeDefault'
import './css/index.css'

injectTapEventPlugin()

ReactDOM.render(
  <FastCampus />,
  document.getElementById('root')
)

registerServiceWorker()

if (module.hot) {
  module.hot.accept()
}