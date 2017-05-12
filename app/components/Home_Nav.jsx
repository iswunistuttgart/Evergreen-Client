import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Home_Nav extends Component {

    componentDidMount() {}

    logoutHandler = () => {

      axios.post('/logout', {session: window.sessionStorage.getItem("session")})
        .then((result) => {
          window.sessionStorage.setItem("session", "");
          window.sessionStorage.setItem("sessionType", "");
          this.props.router.push('/')
        })
        .catch((e) => {

        })
    }

    render() {
        return (
            <div>
                <div className="top-bar">
                    <div className="top-bar-left">
                        <ul className="menu">
                            <li className="menu-text">Username</li>
                            <li>
                                <a onClick={this.logoutHandler}>Logout</a>
                            </li>
                        </ul>
                    </div>
                    <div className="top-bar-right">
                        <form onSubmit={this.OnAddGroup}>
                            <ul className="menu">
                                <li>
                                    <input type="search" placeholder="type new groupname" ref="search"/>
                                </li>
                                <li>
                                    <input ref="addGroupInput" type="submit" onClick={() => {this.props.createHandler(this.refs.search.value); this.refs.search.value = ''}} className="button" value="Add Group"/>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home_Nav;
