import React, {Component} from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

class Home_Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this.setState({username: window.sessionStorage.getItem("username")})
  }

  logoutHandler = () => {
    axios.post('/rest/auth/logout', {session: window.sessionStorage.getItem("session")}).then((result) => {
      window.sessionStorage.setItem("session", "");
      window.sessionStorage.setItem("sessionType", "");
      this.props.router.push('/')
    }).catch((e) => {})
  }

  render() {
    return (
      <page-top>
        <div className="page-top clearfix">
          <a href="/" className="al-logo clearfix">
            <span>Ever</span>
            Green
          </a>
          <div style={{
              marginLeft: '25px',
              color: '#ffffff',
              fontSize: '24px',
              whiteSpace: 'nowrap',
              float: 'left',
              lineHeight: '60px'}}>
            <span>{this.state.username}</span>
          </div>
          <div className="logoutWrapper">
            <a href onClick={this.logoutHandler}>Logout</a>
          </div>
          <div className="page-top-search">
            <div className="input-group">
              <input type="search" className="form-control" ref="search" placeholder="Type new groupname"/>
              <span className="input-group-btn">
                <button className="btn btn-primary stand-still" ref="addGroupInput" onClick={() => {
                                this.props.createHandler(this.refs.search.value);
                                this.refs.search.value = ''
                              }}  type="button">Add Group</button>
              </span>
            </div>
          </div>
        </div>
      </page-top>
    )
    // return (
    //   <div>
    //     <div className="top-bar">
    //       <div className="top-bar-left">
    //         <ul className="menu">
    //           <li className="menu-text">Username</li>
    //           <li>
    //             <a onClick={this.logoutHandler}>Logout</a>
    //           </li>
    //         </ul>
    //       </div>
    //       <div className="top-bar-right">
    //         <form onSubmit={this.OnAddGroup}>
    //           <ul className="menu">
    //             <li>
    //               <input type="search" placeholder="type new groupname" ref="search"/>
    //             </li>
    //             <li>
    //               <input ref="addGroupInput" type="submit" onClick={() => {
    //                 this.props.createHandler(this.refs.search.value);
    //                 this.refs.search.value = ''
    //               }} className="button" value="Add Group"/>
    //             </li>
    //           </ul>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

export default Home_Nav;
