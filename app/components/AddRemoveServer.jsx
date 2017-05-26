import React, {Component} from 'react';
import axios from 'axios';

class AddRemoveServer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addFlag: false,
      removeFlag: false,
      showFlag: false,
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

    if (this.state.showFlag === true) {
      this.setState({showFlag: false})
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

    if (this.state.showFlag === true) {
      this.setState({showFlag: false})
    }

    this.setState({
      removeFlag: !removeFlag
    });
  }

  handleShowServer() {

    console.log('this', this.props);

    let {showFlag} = this.state;
    if (this.state.addFlag == true) {
      this.setState({addFlag: false});
    }

    if (this.state.removeFlag === true) {
      this.setState({removeFlag: false})
    }

    this.setState({
      showFlag: !showFlag
    });
  }

  addServer = () => {

    let regex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"

    let pattern = new RegExp(regex);

    if (!this.state.addServerName) {
      return this.setState({errorFlag: 'Please input server name'})
    } else if (!this.state.addServerIp) {
      return this.setState({errorFlag: 'Please input server ip'})
    } else if (!this.state.addServerPort) {
      return this.setState({errorFlag: 'Please input server port'})
    } else if (!pattern.test(this.state.addServerIp)) {
      return this.setState({errorFlag: 'Please enter valid server address'})
    } else {
      axios.post('/rest/server/add', {servername: this.state.addServerName, serverip: this.state.addServerIp, serverport: this.state.addServerPort})
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
    axios.post('/rest/server/remove', {servername: this.state.removeServerName})
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
      <div className="row">
        <div className="row">
          <div className="col-md-4">
            <button className="btn btn-primary btn-full" type="button" onClick={this.handleShowServer.bind(this)}>Show Server Info</button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-warning btn-full btn-with-icon" type="button" onClick={this.handleAddServer.bind(this)}>
              <i className="glyphicon glyphicon-plus"></i>
              Add Server
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-danger btn-full btn-with-icon" type="button" onClick={this.handleDeleteServer.bind(this)}>
              <i className="glyphicon glyphicon-minus"></i>
              Remove Server
            </button>
          </div>
        </div>
        {this.state.addFlag == true
          ? <div style={{marginTop: '25px'}}>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" name="addServerName" type="text" placeholder="Servername" onChange={this.handleInputChange}/>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" name="addServerIp" type="text" placeholder="IP" onChange={this.handleInputChange}/>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" name="addServerPort" type="number" placeholder="Port" onChange={this.handleInputChange}/>
                </div>
              </div>
              {
                this.state.errorFlag &&
                <span className="col-md-12" style={{color: 'red', fontSize: 14}}>{this.state.errorFlag}</span>
              }
              <button type="button" className="btn btn-warning pull-right" onClick={this.addServer}>Add Server</button>
            </div>
            : <span></span>
        }
        {this.state.showFlag == true
          ? <div style={{marginTop: '25px'}}>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" value={this.props.selectedServer.serverName} type="text" disabled/>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" value={this.props.selectedServer.serverAdress} type="text" disabled/>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input className="form-control" value={this.props.selectedServer.port} type="number" disabled/>
                </div>
              </div>
            </div>
            : <span></span>
        }
        {this.state.removeFlag == true
          ? <div style={{marginTop: '25px'}}>
              <div className="col-md-12">
                <div className="form-group">
                  <select className="form-control" name="removeServerName" onChange={this.handleInputChange}>
                    <option>Choose server to remove</option>
                    {
                      this.props.servers.map((entry, key) => {
                        return (
                          <option key={key} value={entry.serverName}>{entry.serverName}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
              <button type="button" className="btn btn-danger pull-right" onClick={this.removeServer}>Remove Server</button>
            </div>
          : <span></span>
        }
      </div>
    )
    // return (
    //   <div>
    //     <div className="AddRemoveServer">
    //       <button className="dropdown button" type="button" onClick={this.handleShowServer.bind(this)}>Show Server Info</button>
    //       <button className="dropdown button" type="button" onClick={this.handleAddServer.bind(this)}>Add Server</button>
    //       <button className="dropdown button" type="button" onClick={this.handleDeleteServer.bind(this)}>Remove Server</button>
    //     </div>
    //
    //     {this.state.addFlag == true
    //       ? <div className="AddServer">
    //           <div className="row">
    //             <div className="large-12 columns">
    //               <label>
    //                 <input name="addServerName" type="text" placeholder="Servername" onChange={this.handleInputChange}/>
    //               </label>
    //             </div>
    //           </div>
    //           <div className="row">
    //             <div className="large-12 columns">
    //               <label>
    //                 <input name="addServerIp" type="text" placeholder="IP" onChange={this.handleInputChange}/>
    //               </label>
    //             </div>
    //           </div>
    //           <div className="row">
    //             <div className="large-12 columns">
    //               <label>
    //                 <input name="addServerPort" type="number" placeholder="Port" onChange={this.handleInputChange}/>
    //               </label>
    //             </div>
    //           </div>
    //           {
    //             this.state.errorFlag &&
    //             <span style={{color: 'red', fontSize: 12}}>{this.state.errorFlag}</span>
    //           }
    //           <button type="button" className="button expanded" onClick={this.addServer}>Add Server</button>
    //         </div>
    //       : null
    //     }
    //
    //     {this.state.showFlag &&
    //       <div className="ShowServer">
    //         <div className="row">
    //           <div className="large-12 columns">
    //             <label>Server Name
    //               <input type="text" value={this.props.selectedServer.serverName} disabled/>
    //             </label>
    //           </div>
    //         </div>
    //         <div className="row">
    //           <div className="large-12 columns">
    //             <label>Server Address
    //               <input type="text" value={this.props.selectedServer.serverAdress} disabled/>
    //             </label>
    //           </div>
    //         </div>
    //         <div className="row">
    //           <div className="large-12 columns">
    //             <label>Server Port
    //               <input type="number" value={this.props.selectedServer.port} disabled/>
    //             </label>
    //           </div>
    //         </div>
    //       </div>
    //     }
    //
    //     {this.state.removeFlag == true
    //       ? <div className="RemoveServer">
    //           <div className="row">
    //             <div className="large-12 columns">
    //               <label>
    //                 <select name="removeServerName" onChange={this.handleInputChange}>
    //                   {
    //                     this.props.servers.map((entry, key) => {
    //                       return (
    //                         <option key={key} value={entry.serverName}>{entry.serverName}</option>
    //                       )
    //                     })
    //                   }
    //                 </select>
    //               </label>
    //             </div>
    //           </div>
    //           <button type="button" className="button expanded" onClick={this.removeServer}>Remove Server</button>
    //         </div>
    //       : null
    //     }
    //   </div>
    // );
  }
}

export default AddRemoveServer;
