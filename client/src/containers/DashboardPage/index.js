import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { events } from '../../data'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import styled from 'styled-components'
import { List } from 'material-ui/List'
import ListItem from './components/ListItem'
import Tutorial from '../../components/Dashboard/tutorial'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  flex-wrap: wrap;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 300px;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  flex-grow: 1;
`

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
)

let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])

const DashboardPage = () => (
  <Wrapper>
    <Left>
      <Paper style={{ padding: '20px', margin: '10px'}}>
        <h1>Classes</h1>
      </Paper>
      <Paper style={{ padding: '20px', margin: '10px' }}>
        <h1>Degree</h1>
      </Paper>
      <Paper style={{ padding: '20px', margin: '10px' }}>
        <h1>More Info...</h1>
      </Paper>
    </Left>
    <Right>
      <Paper style={{padding: '20px', minHeight: '500px', height: '50%', margin: '10px'}}>
        <BigCalendar
          {...this.props}
          events={events}
          views={allViews}
          defaultDate={new Date(2015, 3, 1)}
        />
      </Paper>
      <Paper style={{padding: '20px', margin: '10px'}}>
        <h1>Connections</h1>
        <Divider />
        <List>
          <ListItem
            primaryText='Andres Rodriguez'
            leftAvatar={{email: 'andrese.rodriguezh@gmail.com', firstName: 'Andres', lastName: 'Rodriguez', size: 50}}
          />
          <ListItem
            primaryText='Boris Pallares'
            leftAvatar={{email: 'bpallares@hotmail.com', firstName: 'Boris', lastName: 'Pallares', size: 50}}
          />
          <ListItem
            primaryText='Yaniv Dudaie'
            leftAvatar={{email: 'yanivdudaie@gmail.com', firstName: 'Yaniv', lastName: 'Dudaie', size: 50}}
          />
          <ListItem
            primaryText='Mohamed Langi'
            leftAvatar={{email: 'mlnp3@mail.umsl.edu', firstName: 'Mohamed', lastName: 'Langi', size: 50}}
          />
          <ListItem
            primaryText='Harprabh Sangha'
            leftAvatar={{email: 'hsswx7@mail.umsl.edu', firstName: 'Harprabh', lastName: 'Sangha', size: 50}}
          />
        </List>
      </Paper>
    </Right>
  </Wrapper>
)

export default DashboardPage
