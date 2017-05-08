import React, {Component} from 'react';

class Home extends Component {

    componentDidMount() {}
    render() {
        return (
            <div>
                <div className="top-bar">
                    <div className="top-bar-left">
                        Username
                    </div>
                    <div className="top-bar-right">
                        <a href="#">Logout</a>
                    </div>
                </div>
                <ul className="flex-container">
                    <li className="flex-item">1</li>
                    <li className="flex-item">2</li>
                    <li className="flex-item">3</li>
                    <li className="flex-item">4</li>
                    <li className="flex-item">5</li>
                    <li className="flex-item">6</li>
                </ul>
            </div>
        );
    }
}

export default Home;
