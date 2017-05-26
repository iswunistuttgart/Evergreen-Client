import React, {Component} from 'react';

class ServerBox extends Component {

  componentDidMount() {
    // this.props.setSelected(this.props.servers[0]);
  }

  handleInputChange = (event) => {

    const target = event.target;
    const value = target.value;
    const name = target.name;

    let temp = {};

    this.props.servers.forEach((entry, key) => {
      if (entry.serverName === value) {
        temp = this.props.servers[key];
      }
    })

    if (temp && temp.serverName) {
      this.props.setSelected(temp);
    }
  }

  render() {
    return (
//       <div>
//         <div className="row">
//           <div className="larger-12 columns">
//             <label>Select your Server
//               <select onChange={this.handleInputChange} value={this.props.selectedServer ? this.props.selectedServer.serverName : null}>
//                 {this.props.servers.map((entry, key) => {
//                   return (
//                     <option key={key} value={entry.serverName}>{entry.serverName}</option>
//                   )
//                 })
// }
//               </select>
//             </label>
//           </div>
//         </div>
//       </div>
      <div className="form-group">
        <label style={{color: '#fff', fontSize: '16px'}}>Select your server</label>
        <select className="form-control" onChange={this.handleInputChange} value={this.props.selectedServer ? this.props.selectedServer.serverName : null}>
          {this.props.servers.map((entry, key) => {
            return (
              <option key={key} value={entry.serverName}>{entry.serverName}</option>
              )
            })
          }
        </select>
      </div>
    );
  }
}

export default ServerBox;
