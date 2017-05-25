import React, {Component} from 'react';
import axios from 'axios';
import Widget from './Widget';
const io = require('socket.io-client');
const socket = io();
import AsyncWaterfall from 'async-waterfall';

class newPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      names: [],
      nodes: [],
      widgets: [],
      widgetselect: 'graph',
      page: {}
    }
  }

  componentDidMount() {

    axios.post('/rest/page/get', {session: window.sessionStorage.getItem("session"), page: this.props.params.pageId}).then((page) => {

      if (page.data.Id) {
        this.setState({
          page: {Id: page.data.Id, Title: page.data.Title, CreatorId: page.data.CreatorId},
          widgets: page.data.ConfigXML
        }, () => {
          this.initialSubscribe();
        })
      }

    }).catch((err) => {
      console.error('err', err);
    })

    socket.on('subscription_result', (socketData) => {

      if (socketData.response.notifications && Object.prototype.toString.call( socketData.response.notifications.UserNotifications ) === '[object Object]') {
        // if (parseInt(socketData.response.notifications.UserNotifications.ContextId) <= this.state.widgets.length - 1) {
        let index = this.findIndex(this.state.widgets, socketData.response.notifications.UserNotifications.ContextId)

        if (index !== -1) {
          this.setState({
            widgets: [
              ...this.state.widgets.slice(0, index),
              Object.assign({}, this.state.widgets[index], {
                value: socketData.response.notifications.UserNotifications.Variable.VarValue
              }),
              ...this.state.widgets.slice(index + 1)
            ]
          })
        }

        // }
      } else {
        socketData.response.notifications.UserNotifications.map((entry) => {
          // if (parseInt(entry.ContextId) <= this.state.widgets.length - 1) {

          let index = this.findIndex(this.state.widgets, entry.ContextId);

          if (index !== -1) {
            this.setState({
              widgets: [
                ...this.state.widgets.slice(0, index),
                Object.assign({}, this.state.widgets[index], {
                  value: entry.Variable.VarValue,
                }),
                ...this.state.widgets.slice(index + 1)
              ]
            })
          }
          // }
        })
      }
    })

    axios.post('/rest/machine/get', {session: window.sessionStorage.getItem("session")})
      .then((result) => {
        if (result.data.Machines && Object.prototype.toString.call( result.data.Machines ) === '[object Object]') {
          this.setState({
            names: [...[], result.data.Machines.Machines]
          })
        } else {
          this.setState({
            names: result.data.Machines
          })
        }
      })
      .catch((e) => {
        console.error('aa', e);
      })

    axios.post('/rest/node/get', {session: window.sessionStorage.getItem("session")})
      .then((result) => {
        if (result.data.GetAllNodesResponse.Nodes && Object.prototype.toString.call( result.data.GetAllNodesResponse.Nodes ) === '[object Object]') {
          this.setState({
            nodes: [...[], result.data.GetAllNodesResponse.Nodes]
          })
        } else {
          this.setState({
            nodes: result.data.GetAllNodesResponse.Nodes
          })
        }
      })
      .catch((e) => {
        console.error('bb', e);
      })
  }

  initialSubscribe = () => {
    let tasks = [];

    this.state.widgets.map((entry) => {
      if (entry.config.isSubscribe) {
        let task = (callback) => {
          let obj = {
            contextId: entry.contextId,
            machineId: entry.config.machineId,
            varId: entry.config.varId,
            tolleranceInterval: entry.config.tolleranceInterval || 200
          }

          axios.post('/rest/subscribe/create', Object.assign({}, obj, {session: window.sessionStorage.getItem("session")}))
            .then((result) => {
              socket.emit('subscribe', {contextId: entry.contextId, tolleranceInterval: parseInt(entry.config.tolleranceInterval || 200), session: window.sessionStorage.getItem("session")}, () => {
                console.log('emitted');
                callback();
              });
            })
            .catch((e) => {
              console.error('bb', e);
            })
        }
        tasks.push(task);
      }
    });

    AsyncWaterfall(tasks, () => {
      console.log('done');
    })
  }

  findIndex = (array, contextId) => {
    let tempContextId = parseInt(contextId);
    let index = -1;

    array.map((entry, key) => {
      if (entry.contextId === tempContextId) {
        index = key;
      }
    })

    return index;
  }

  addWidget = () => {

    let tempIndex = 1;

    if (this.state.widgets && this.state.widgets.length) {
      this.state.widgets.map((entry) => {
        if (entry.contextId > tempIndex) {
          tempIndex = entry.contextId;
        }
      })
      tempIndex ++;
    }

    this.setState({
      widgets: [...this.state.widgets, {contextId: tempIndex, widgetType: this.state.widgetselect, value: '', config: {machineId: '', varId: '', tolleranceInterval: '', isSubscribe: false}, name: ''}]
    }, () => {
      this.pageUpdate();
    })
  }

  pageUpdate = () => {
    let tempString = window.btoa(JSON.stringify(this.state.widgets));

    axios.post('/rest/page/update', {session: window.sessionStorage.getItem("session"), page: {Id: this.props.params.pageId, CreatorId: this.state.page.CreatorId, Title: this.state.page.Title, ConfigXML: tempString}})
      .then((result) => {

      })
      .catch((e) => {
        console.error('cc', e);
      })
  }

  subscribe = (obj) => {
    axios.post('/rest/subscribe/create', Object.assign({}, obj, {session: window.sessionStorage.getItem("session")}))
      .then((result) => {
        socket.emit('subscribe', {contextId: obj.contextId, tolleranceInterval: parseInt(obj.tolleranceInterval), session: window.sessionStorage.getItem("session")});
      })
      .catch((e) => {
        console.error('bb', e);
      })
  }

  readVariable = (obj) => {
    axios.post('/rest/subscribe/read', Object.assign({}, obj, {session: window.sessionStorage.getItem("session")}))
      .then((result) => {

        setTimeout(() => {

          let index = this.findIndex(this.state.widgets, obj.contextId);

          if (index !== -1) {
            this.setState({
              widgets: [
                ...this.state.widgets.slice(0, index),
                Object.assign({}, this.state.widgets[index], {
                  value: result.data.readVarSetResult.VarValues.VarValue,
                }),
                ...this.state.widgets.slice(index + 1)
              ]
            })
          }
        }, 200)
      })
      .catch((e) => {
        console.error('bb', e);
      })
  }

  deletePage = (index, contextId) => {
    this.setState({
      widgets: [
        ...this.state.widgets.slice(0, index),
        ...this.state.widgets.slice(index + 1)
      ]
    }, () => {
      axios.post('/rest/subscribe/remove', {session: window.sessionStorage.getItem("session"), contextId: contextId})
      this.pageUpdate();
    })
  }

  writeVariable = (obj) => {
    axios.post('/rest/subscribe/write', Object.assign({}, obj, {session: window.sessionStorage.getItem("session")}))
      .then((result) => {

        let index = this.findIndex(this.state.widgets, obj.contextId);

        if (index !== -1) {
          this.setState({
            widgets: [
              ...this.state.widgets.slice(0, index),
              Object.assign({}, this.state.widgets[index], {
                value: result.data.readVarSetResult.VarValues.VarValue
              }),
              ...this.state.widgets.slice(index + 1)
            ]
          })
        }
      })
      .catch((e) => {
        console.error('bb', e);
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

  handleValueChange = (value, contextId) => {

    let index = this.findIndex(this.state.widgets, contextId);

    if (index !== -1) {
      this.setState({
        widgets: [
          ...this.state.widgets.slice(0, index),
          Object.assign({}, this.state.widgets[index], {
            value: value
          }),
          ...this.state.widgets.slice(index + 1)
        ]
      })
    }
  }

  setConfig = (config, contextId) => {

    let index = this.findIndex(this.state.widgets, contextId);

    if (index !== -1) {
      this.setState({
        widgets: [
          ...this.state.widgets.slice(0, index),
          Object.assign({}, this.state.widgets[index], {
            config: config
          }),
          ...this.state.widgets.slice(index + 1)
        ]
      })
    }
  }

  setTitle = (title, contextId) => {

    let index = this.findIndex(this.state.widgets, contextId);

    if (index !== -1) {
      this.setState({
        widgets: [
          ...this.state.widgets.slice(0, index),
          Object.assign({}, this.state.widgets[index], {
            title: title
          }),
          ...this.state.widgets.slice(index + 1)
        ]
      }, () => {
        this.pageUpdate();
      })
    }
  }

  logoutHandler = () => {
    axios.post('/rest/auth/logout', {session: window.sessionStorage.getItem("session")}).then((result) => {
      window.sessionStorage.setItem("session", "");
      window.sessionStorage.setItem("sessionType", "");
      this.context.router.push('/')
    }).catch((e) => {})
  }

  render() {
    return (
      <div>
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="menu">
              <li className="menu-text">Username</li>
              <li>
                <a onClick={this.logoutHandler}>Logout</a>
              </li>
            </ul>
          </div>
          <div className="top-bar-right">
            <form>
              <ul className="menu">
                <li>
                  <select name="widgetselect" onChange={this.handleInputChange}>
                    <option value="graph">Graph</option>
                    <option value="toggle">Toggle Button</option>
                    <option value="lamp">LED</option>
                    <option value="inputfield">Inputfield</option>
                    <option value="outputfield">Outputfield</option>
                  </select>
                </li>
                <li>
                  <input type="button" className="button" onClick={this.addWidget} value="Add Widget"/>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div className="flex-container">
          {/* <pre>{JSON.stringify(this.state, false, 2)}</pre> */}
          {this.state.widgets && this.state.widgets.map((entry, key) => {
            return (
              <Widget
                key={entry.contextId}
                id={entry.contextId}
                keyindex={key}
                subscribe={this.subscribe}
                valueChange={this.handleValueChange}
                readVariable={this.readVariable}
                writeVariable={this.writeVariable}
                widgetType={entry.widgetType}
                names={this.state.names}
                nodes={this.state.nodes}
                value={entry.value}
                config={entry.config}
                setConfig={this.setConfig}
                pageUpdate={this.pageUpdate}
                delete={this.deletePage}
                setTitle={this.setTitle}
                title={entry.title}
              />
            )
          })
          }
        </div>
      </div>

    );
  }
}

newPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default newPage;
