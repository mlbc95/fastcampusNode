import React from 'react'
import ReactDOM from 'react-dom'
import FastCampus from './containers/FastCampus'
import registerServiceWorker from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'
import 'font-awesome/css/font-awesome.css'
import './css/index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Material UI theme wrapper
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ThemeDefault from './ThemeDefault'

injectTapEventPlugin()

ReactDOM.render(
  <MuiThemeProvider muiTheme={ThemeDefault}>
    <FastCampus />
  </MuiThemeProvider>,
  document.getElementById('app')
)

registerServiceWorker()

if (module.hot) {
  module.hot.accept()
}
