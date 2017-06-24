import React from 'react';
import ReactDOM from 'react-dom';
import FastCampusContainer from './containers/FastCampusContainer';
import registerServiceWorker from './registerServiceWorker'; 
import './css/index.css';

ReactDOM.render(
  <FastCampusContainer />,
  document.getElementById('root')
);
registerServiceWorker(); 