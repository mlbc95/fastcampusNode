import React from 'react'
import ReactDOM from 'react-dom'
import FastCampusContainer from './containers/FastCampusContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin';
import './css/index.css'

injectTapEventPlugin();

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