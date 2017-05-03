import React, {Component} from 'react';

class AddRemoveServer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addFlag: false,
            removeFlag: false,
            server: []
        };
    }

    handleAddServer() {
        let {addFlag} = this.state;
        if (this.state.removeFlag == true) {
            this.setState({removeFlag: false});
        }
        this.setState({
            addFlag: !addFlag
        });
    }

    handleDeleteServer() {
        let {removeFlag} = this.state;
        if (this.state.addFlag == true) {
            this.setState({addFlag: false});
        }
        this.setState({
            removeFlag: !removeFlag
        });
    }

    render() {
        return (
            <div>
                <div className="AddRemoveServer">
                    <button className="dropdown button" type="button" onClick={this.handleAddServer.bind(this)}>Add Server</button>
                    <button className="dropdown button" type="button" onClick={this.handleDeleteServer.bind(this)}>Remove Server</button>
                </div>

                {this.state.addFlag == true
                    ? <div className="AddServer">
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>
                                        <input type="text" placeholder="Servername"/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>
                                        <input type="password" placeholder="IP"/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>
                                        <input type="password" placeholder="Port"/>
                                    </label>
                                </div>
                            </div>
                            <button className="button expanded" onClick={this.AddServer}>Add Server</button>
                        </div>
                    : null
}

                {this.state.removeFlag == true
                    ? <div className="RemoveServer">
                            <div className="row">
                                <div className="large-12 columns">
                                    <label>
                                        <input type="text" placeholder="Servername"/>
                                    </label>
                                </div>
                            </div>
                            <button className="button expanded">Remove Server</button>
                        </div>
                    : null
}
            </div>
        );
    }
}

export default AddRemoveServer;
