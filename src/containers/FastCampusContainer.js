import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

// App components
import NavBar from '../components/NavBar/NavBar'
import Home from '../components/Home/Home'
import NotFound from '../components/NotFound/NotFound'

const FastCampusContainer = () => (
  <BrowserRouter>
    <div style={{ height: '100%' }}>
      <NavBar />
      
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
)

export default FastCampusContainer




