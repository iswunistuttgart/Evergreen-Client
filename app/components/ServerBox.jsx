import React, {Component} from 'react';

class ServerBox extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="larger-12 columns">
                        <label>Select your Server
                            <select>
                                {
                                  this.props.servers.map((entry, key) => {
                                    return (
                                      <option key={key} value={entry}>{entry}</option>
                                    )
                                  })
                                }
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServerBox;
