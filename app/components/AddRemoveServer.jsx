import React, {Component} from 'react';
import axios from 'axios';

class AddRemoveServer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addFlag: false,
      removeFlag: false,
      addServerName: '',
      addServerIp: '',
      addServerPort: '',
      removeServerName: '',
      errorFlag: null,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
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

  addServer = () => {
    if (!this.state.addServerName) {
      return this.setState({errorFlag: 'Please input server name'})
    } else if (!this.state.addServerIp) {
      return this.setState({errorFlag: 'Please input server ip'})
    } else if (!this.state.addServerPort) {
      return this.setState({errorFlag: 'Please input server port'})
    } else {
      axios.post('/addserver', {servername: this.state.addServerName, serverip: this.state.addServerIp, serverport: this.state.addServerPort})
        .then((result) => {
          this.setState({
            addServerName: '',
            addServerIp: '',
            addServerPort: '',
            errorFlag: null,
            addFlag: false
          })
          this.props.refreshServers();
        })
        .catch((e) => {
          this.setState({errorFlag: e.response.data})
          console.error('error occured', e);
        })
    }
  }

  removeServer = () => {
    axios.post('/removeserver', {servername: this.state.removeServerName})
      .then((result) => {
        this.setState({
          removeServerName: '',
          errorFlag: null,
          removeFlag: false
        })
        this.props.refreshServers();
      })
      .catch((e) => {
        console.error('error occured', e);
      })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
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
                    <input name="addServerName" type="text" placeholder="Servername" onChange={this.handleInputChange}/>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="large-12 columns">
                  <label>
                    <input name="addServerIp" type="text" placeholder="IP" onChange={this.handleInputChange}/>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="large-12 columns">
                  <label>
                    <input name="addServerPort" type="number" placeholder="Port" onChange={this.handleInputChange}/>
                  </label>
                </div>
              </div>
              {
                this.state.errorFlag &&
                <span style={{color: 'red', fontSize: 12}}>{this.state.errorFlag}</span>
              }
              <button type="button" className="button expanded" onClick={this.addServer}>Add Server</button>
            </div>
          : null
        }

        {this.state.removeFlag == true
          ? <div className="RemoveServer">
              <div className="row">
                <div className="large-12 columns">
                  <label>
                    <select name="removeServerName" onChange={this.handleInputChange}>
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
              <button type="button" className="button expanded" onClick={this.removeServer}>Remove Server</button>
            </div>
          : null
        }
      </div>
    );
  }
}

export default AddRemoveServer;
