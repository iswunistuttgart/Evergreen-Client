import React from 'react';
import Login from './Login';
import ServerBox from './ServerBox';
import AddRemoveServer from './AddRemoveServer';

const LoginApp = () => {
    return (
        <div>
            <h1 className="page-title">Evergreen-Client</h1>
            <div className="row">
                <div className="column small-centered small-11 medium-6 large-5">
                    <div className="container">
                        <form>
                            <ServerBox/>
                            <AddRemoveServer/>
                            <Login/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginApp;
