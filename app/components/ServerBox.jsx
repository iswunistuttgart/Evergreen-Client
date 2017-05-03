import React, {Component} from 'react';

class ServerBox extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="larger-12 columns">
                        <label>Select your Server
                            <select>
                                <option value="husker">Husker</option>
                                <option value="starbuck">Starbuck</option>
                                <option value="hotdog">Hot Dog</option>
                              <option value="apollo">Apollo</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServerBox;
