
import './App.css';
import { Component } from 'react'
import { BrowserRouter as Router, Route, Link as RouterLink, HashRouter, Routes, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import axios from 'axios'
import io from 'socket.io-client'
import {SocketContext} from './contexts/SocketContext'
const Base_Url = '' //'http://localhost:8000'

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedInUser: {},
      isLoggedIn: false,
      socket: {}
    }

  }

  // login client side
  login = async (user) => {
    this.setState({
      loggedInUser: user,
      isLoggedIn: true,
      socket: io(':8000', { query: 'userId=' + user._id })
    }, () => {
      // connection stablished with server
      this.state.socket.on('stablish-connection', data => {
        console.log(data)
      });
    })

  }

  // logout
  logout = async () => {
    // clear cookies from server side
    let result = await axios.get(Base_Url + '/api/logout')
    // logout client side
    if (result.status == 200) {
      this.setState({
        loggedInUser: {},
        isLoggedIn: false
      })
      // terminate connection with server
      this.state.socket.disconnect(true);
    }
  }

  // if user closes the tab, log him out
  async componentWillUnmount() {
    if (this.state.isLoggedIn) {
      this.logout()
    }
  }

  render() {
    let page
    // specifiy which routes are exposed in case of logging in/ out
    if (!this.state.isLoggedIn) {
      page = (
        <Router>
          <Routes>
            <Route path='/' exact element={<Login login={this.login}></Login>}></Route>
            <Route path='/signup' exact element={<Signup login={this.login}></Signup>}></Route>
          </Routes>
        </Router>
      )
    } else {
      page = (
        <SocketContext.Provider value={this.state.socket}>
          <div className='content'>
            <Router>
              <Routes>
                <Route path='/' exact element={<Home loggedInUser={this.state.loggedInUser} logout={this.logout}></Home>}></Route>
              </Routes>
            </Router>
          </div>
        </SocketContext.Provider>
      )
    }
    return (
      <div className="App">
        {page}

      </div>
    );
  };
}

export default App;
