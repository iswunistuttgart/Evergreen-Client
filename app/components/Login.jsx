import React, {Component} from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

require('jquery.soap');

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorFlag: ''
    };
  }

  componentDidMount() {}

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleLogin = () => {
    if (!this.state.username) {
      return this.setState({errorFlag: 'Please input username'})
    } else if (!this.state.password) {
      return this.setState({errorFlag: 'Please input password'})
    } else {
      axios.post('/rest/auth/login', {
        servername: this.props.selectedServer.serverName,
        serveradress: this.props.selectedServer.serverAdress,
        port: this.props.selectedServer.port,
        username: this.state.username,
        password: this.state.password
      }).then((result) => {
        this.setState({username: '', password: '', errorFlag: ''})

        console.log('@@!!', result)

        window.sessionStorage.setItem("session", result.data.Session);
        window.sessionStorage.setItem("sessionType", result.data.SessionType);

        this.props.router.push('/home')
      }).catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.setState({errorFlag: error.response.data.message})
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    }
  }

  render() {
    return (
      <div className="Login">
        <div className="row">
          <div className="large-12 columns">
            <label>
              <input name="username" onChange={this.handleInputChange} type="text" placeholder="Username"/>
            </label>
          </div>
        </div>
        <div className="row">
          <div className="large-12 columns">
            <label>
              <input name="password" onChange={this.handleInputChange} type="password" placeholder="Password"/>
            </label>
          </div>
        </div>
        {!this.props.loginError && this.state.errorFlag && <span style={{
          color: 'red',
          fontSize: 12
        }}>{this.state.errorFlag}</span>
}
        {this.props.loginError && <span style={{
          color: 'red',
          fontSize: 12
        }}>{this.props.loginError}</span>
}
        <button type="button" onClick={this.handleLogin} className="button expanded">Login</button>
      </div>

    );
  }
}

export default Login;
