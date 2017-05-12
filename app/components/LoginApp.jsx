import React, {Component} from 'react';
import Login from './Login';
import ServerBox from './ServerBox';
import AddRemoveServer from './AddRemoveServer';
import axios from 'axios';

class LoginApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      selected: {}
    };
  }

  componentWillMount() {
    axios.get('readserverlist')
      .then((result) => {
        this.setState({
          servers: result.data.serverlist,
          selected: result.data.serverlist[0]
        })
      })
      .catch((e) => {
        console.error('error occured', e);;
      })
  }

  componentDidMount () {
  }

  refreshServers = () => {
    axios.get('readserverlist')
      .then((result) => {
        this.setState({servers: result.data.serverlist, selected: result.data.serverlist[0]})
      })
      .catch((e) => {
        console.error('error occured', e);;
      })
  }

  setSelected = (selected) => {
    this.setState({
      selected: selected
    })
  }

  render () {
    return (
      <div>
        <h1 className="page-title">Evergreen-Client</h1>
        <div className="row">
          <div className="column small-centered small-11 medium-6 large-5">
            <div className="container">
              <form>
                <ServerBox servers={this.state.servers} setSelected={this.setSelected} selectedServer={this.state.selected}/>
                <AddRemoveServer servers={this.state.servers} refreshServers={this.refreshServers} selectedServer={this.state.selected}/>
                <Login router={this.context.router} selectedServer={this.state.selected}/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginApp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default LoginApp;
