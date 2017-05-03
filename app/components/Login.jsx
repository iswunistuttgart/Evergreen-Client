import React, {Component} from 'react';

class Login extends Component {
    render() {
        return (
            <div className="Login">
                <div className="row">
                    <div className="large-12 columns">
                        <label>
                            <input type="text" placeholder="Username"/>
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="large-12 columns">
                        <label>
                            <input type="password" placeholder="Password"/>
                        </label>
                    </div>
                </div>
                <button className="button expanded">Login</button>
            </div>

        );
    }
}

export default Login;
