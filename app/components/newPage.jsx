import React, {Component} from 'react';
import axios from 'axios';
import Widget from './Widget';
const io = require('socket.io-client');
const socket = io();

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
      console.log('aa', page.data);
      this.setState({
        page: {Id: page.data.Id, Title: page.data.Title, CreatorId: page.data.CreatorId},
        widgets: page.data.ConfigXML
      })
    }).catch((err) => {
      console.error('err', err);
    })

    socket.on('subscription_result', (socketData) => {

      if (socketData.response.notifications && Object.prototype.toString.call( socketData.response.notifications.UserNotifications ) === '[object Object]') {
        if (parseInt(socketData.response.notifications.UserNotifications.ContextId) <= this.state.widgets.length - 1) {
          this.setState({
            widgets: [
              ...this.state.widgets.slice(0, parseInt(socketData.response.notifications.UserNotifications.ContextId)),
              Object.assign({}, this.state.widgets[parseInt(socketData.response.notifications.UserNotifications.ContextId)], {
                value: socketData.response.notifications.UserNotifications.Variable.VarValue
              }),
              ...this.state.widgets.slice(parseInt(socketData.response.notifications.UserNotifications.ContextId) + 1)
            ]
          })
        }
      } else {
        socketData.response.notifications.UserNotifications.map((entry) => {
          if (parseInt(entry.ContextId) <= this.state.widgets.length - 1) {

            this.setState({
              widgets: [
                ...this.state.widgets.slice(0, parseInt(entry.ContextId)),
                Object.assign({}, this.state.widgets[parseInt(entry.ContextId)], {
                  value: entry.Variable.VarValue,
                }),
                ...this.state.widgets.slice(parseInt(entry.ContextId) + 1)
              ]
            })
          }
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

  addWidget = () => {
    this.setState({
      widgets: [...this.state.widgets, {widgetType: this.state.widgetselect, value: ''}]
    }, () => {
      let tempString = window.btoa(JSON.stringify(this.state.widgets));

      axios.post('/rest/page/update', {session: window.sessionStorage.getItem("session"), page: {Id: this.props.params.pageId, CreatorId: this.state.page.CreatorId, Title: this.state.page.Title, ConfigXML: tempString}})
        .then((result) => {

        })
        .catch((e) => {
          console.error('cc', e);
        })
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

        this.setState({
          widgets: [
            ...this.state.widgets.slice(0, obj.contextId),
            Object.assign({}, this.state.widgets[obj.contextId], {
              value: result.data.readVarSetResult.VarValues.VarValue,
            }),
            ...this.state.widgets.slice(obj.contextId + 1)
          ]
        })
      })
      .catch((e) => {
        console.error('bb', e);
      })
  }

  writeVariable = (obj) => {
    axios.post('/rest/subscribe/write', Object.assign({}, obj, {session: window.sessionStorage.getItem("session")}))
      .then((result) => {

        this.setState({
          widgets: [
            ...this.state.widgets.slice(0, obj.contextId),
            Object.assign({}, this.state.widgets[obj.contextId], {
              value: result.data.writeVarSetInformations.VarValues.VarValue
            }),
            ...this.state.widgets.slice(obj.contextId + 1)
          ]
        })
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

  handleValueChange = (value, index) => {

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
              <Widget key={key} id={key} subscribe={this.subscribe} valueChange={this.handleValueChange} readVariable={this.readVariable} writeVariable={this.writeVariable} widgetType={entry.widgetType} names={this.state.names} nodes={this.state.nodes} value={entry.value}/>
            )
          })
          }
          {/* <ul className="list-group">
            <li className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <div className="WidgetButton">
                Graph
              </div>

              <SimpleLineChart/>
            </li>
            <div className="WidgetButton">
              <button className="dropdown button" type="button">Configure Widget</button>
            </div>
            <div className="large-12 columns">
              <form>
                <div className="row">
                  <div className="larger-12 columns">

                    <label>Select machine
                      <select>
                        <option value="">TEST_MACHINE</option>
                        <option value="">TEST_MACHINE2</option>
                      </select>
                    </label>
                    <label>Bind value
                      <select>
                        <option value="">StaticBoolean</option>
                        <option value="">Double</option>
                        <option value="">Integer</option>
                        <option value="">DynamicBoolean</option>
                      </select>
                    </label>
                    <label>Update intervall in milliseconds
                      <input type="number" value="5"/>
                    </label>
                    <input type="checkbox"/>
                    <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                  </div>
                </div>
                <button className="button expanded">Set Widget</button>
              </form>
            </div>
          </ul> */}

          {/* <ul className="list-group">
            <li className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <div className="WidgetButton">
                Toggle Button
              </div>
              <div className="switch round large">
                <input id="exampleRadioSwitch3" type="radio" name="testGroup"/>
                <label htmlFor="exampleRadioSwitch3"></label>
              </div>

            </li>
            <div className="WidgetButton">
              <button className="dropdown button" type="button">Configure Widget</button>
            </div>
            <div className="large-12 columns">
              <form>
                <div className="row">
                  <div className="larger-12 columns">

                    <label>Select machine
                      <select>
                        <option value="">TEST_MACHINE</option>
                        <option value="">TEST_MACHINE2</option>
                      </select>
                    </label>
                    <label>Bind value
                      <select>
                        <option value="">StaticBoolean</option>
                        <option value="">Double</option>
                        <option value="">Integer</option>
                        <option value="">DynamicBoolean</option>
                      </select>
                    </label>
                    <label>Update intervall in milliseconds
                      <input type="number" value="5"/>
                    </label>
                    <input type="checkbox"/>
                    <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                  </div>
                </div>
                <button className="button expanded">Set Widget</button>
              </form>
            </div>
          </ul> */}

          {/* <ul className="list-group">
            <li className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <div className="WidgetButton">
                Outputfield
              </div>
              <input type="search" placeholder="Value"/>
            </li>
            <div className="WidgetButton">
              <button className="dropdown button" type="button">Configure Widget</button>
            </div>
            <div className="large-12 columns">
              <form>
                <div className="row">
                  <div className="larger-12 columns">

                    <label>Select machine
                      <select>
                        <option value="">TEST_MACHINE</option>
                        <option value="">TEST_MACHINE2</option>
                      </select>
                    </label>
                    <label>Bind value
                      <select>
                        <option value="">StaticBoolean</option>
                        <option value="">Double</option>
                        <option value="">Integer</option>
                        <option value="">DynamicBoolean</option>
                      </select>
                    </label>
                    <label>Update intervall in milliseconds
                      <input type="number" value="5"/>
                    </label>
                    <input type="checkbox"/>
                    <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                  </div>
                </div>
                <button className="button expanded">Set Widget</button>
              </form>
            </div>
          </ul>

          <ul className="list-group">
            <li className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <div className="WidgetButton">
                Inputfield
              </div>
              <input type="search" placeholder="Value"/>
            </li>
            <div className="WidgetButton">
              <button className="dropdown button" type="button">Configure Widget</button>
            </div>
            <div className="large-12 columns">
              <form>
                <div className="row">
                  <div className="larger-12 columns">

                    <label>Select machine
                      <select>
                        <option value="">TEST_MACHINE</option>
                        <option value="">TEST_MACHINE2</option>
                      </select>
                    </label>
                    <label>Bind value
                      <select>
                        <option value="">StaticBoolean</option>
                        <option value="">Double</option>
                        <option value="">Integer</option>
                        <option value="">DynamicBoolean</option>
                      </select>
                    </label>
                    <label>Update intervall in milliseconds
                      <input type="number" value="5"/>
                    </label>
                    <input type="checkbox"/>
                    <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                  </div>
                </div>
                <button className="button expanded">Set Widget</button>
              </form>
            </div>
          </ul> */}

          {/* <ul className="list-group">
            <li className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <div className="LED">
                LED
                <div className="circle"></div>
              </div>
            </li>
            <div className="WidgetButton">
              <button className="dropdown button" type="button">Configure Widget</button>
            </div>
            <div className="large-12 columns">
              <form>
                <div className="row">
                  <div className="larger-12 columns">

                    <label>Select machine
                      <select>
                        <option value="">TEST_MACHINE</option>
                        <option value="">TEST_MACHINE2</option>
                      </select>
                    </label>
                    <label>Bind value
                      <select>
                        <option value="">StaticBoolean</option>
                        <option value="">Double</option>
                        <option value="">Integer</option>
                        <option value="">DynamicBoolean</option>
                      </select>
                    </label>
                    <label>Update intervall in milliseconds
                      <input type="number" value="5"/>
                    </label>
                    <input type="checkbox"/>
                    <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                  </div>
                </div>
                <button className="button expanded">Set Widget</button>
              </form>
            </div>
          </ul> */}

        </div>
      </div>

    );
  }
}
export default newPage;
