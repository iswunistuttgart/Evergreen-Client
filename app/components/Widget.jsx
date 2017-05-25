import React, {Component} from 'react';
import SimpleLineChart from './SimpleLineChart';

class Widget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      configureFlag: false,
    }
  }

  componentDidMount() {}

  setWidgetHandle() {
    this.setState({configureFlag: false});
    if (this.refs['subscribe'].checked) {
      this.props.subscribe({contextId: this.props.id, machineId: this.refs['selectMachine'].value, varId: this.refs['bindValue'].value, tolleranceInterval: this.refs['tolleranceInterval'].value});
    } else {
      if (this.props.widgetType === 'toggle') {
        let temp = (!this.props.value || this.props.value === 'false' || this.props.value === '0') ? 'false' : 'true';
        this.props.writeVariable({contextId: this.props.id, machineId: this.refs['selectMachine'].value, varId: this.refs['bindValue'].value, tolleranceInterval: this.refs['tolleranceInterval'].value, varValue: temp})
      } else if ((this.props.value || this.props.value !== false || this.props.value !== '0' || this.props.value !== 0) && this.props.widgetType === 'inputfield') {
        this.props.writeVariable({contextId: this.props.id, machineId: this.refs['selectMachine'].value, varId: this.refs['bindValue'].value, tolleranceInterval: this.refs['tolleranceInterval'].value, varValue: this.props.value})
      } else {
        this.props.readVariable({contextId: this.props.id, machineId: this.refs['selectMachine'].value, varId: this.refs['bindValue'].value, tolleranceInterval: this.refs['tolleranceInterval'].value})
      }
    }
  }

  handleInputValueChange = (event) => {
    this.props.valueChange(event.target.value, this.props.id);
  }

  handleCheckValueChange = (event) => {
    this.props.valueChange(event.target.checked, this.props.id)
  }

  render() {
    return (
      <ul className="list-group widget-group">
        <li className="list-group-item">
          <div className="handleGroupname">
            <div>
              Rename
            </div>
            <div>
              Delete
            </div>
          </div>
          {this.props.widgetType === 'graph' &&
            <div>
              <div className="WidgetButton">
                Graph
              </div>
              <SimpleLineChart id={this.props.id} value={this.props.value} />
            </div>
          }
          {this.props.widgetType === 'toggle' &&
            <div className="css-switch">
              <div className="WidgetButton">
                Toggle Button
              </div>
              <label className="switch">
                <input type="checkbox" checked={this.props.value && this.props.value != 'false' && this.props.value != '0'} onChange={this.handleCheckValueChange}/>
                <div className="slider-switch round"></div>
              </label>
            </div>
          }
          {this.props.widgetType === 'lamp' &&
            <div className="LED">
              LED
              {(!this.props.value || this.props.value == 'false' || this.props.value == '0') ?
                  <div className="circle"></div>
                : <div className="circle" style={{backgroundColor: 'green'}}></div>
              }

            </div>
          }
          {this.props.widgetType === 'inputfield' &&
            <div>
              <div className="WidgetButton">
                Inputfield
              </div>
              <input type="search" value={this.props.value} onChange={this.handleInputValueChange} placeholder="Value"/>
            </div>
          }
          {this.props.widgetType === 'outputfield' &&
            <div>
              <div className="WidgetButton">
                Outputfield
              </div>
              <input type="search" value={this.props.value} placeholder="Value" disabled/>
            </div>
          }
        </li>
        {!this.state.configureFlag &&
          <div className="WidgetButton">
            <button className="dropdown button" type="button" onClick={()=>{this.setState({configureFlag: true})}}>Configure Widget</button>
          </div>
        }
        {/* <pre>
          {JSON.stringify(this.props, false, 2)}
        </pre> */}

        {this.state.configureFlag &&
          <div className="large-12 columns">
            <form>
              <div className="row">
                <div className="larger-12 columns">

                  <label>Select machine
                    <select ref="selectMachine">
                      {
                        (this.props.names && this.props.names.length) ? this.props.names.map((entry) => {
                          return (
                            <option value={entry.Id} key={entry.Id}>{entry.Name}</option>
                          )
                        })
                        :
                        <option/>
                      }
                    </select>
                  </label>
                  <label>Bind value
                    <select ref="bindValue">
                      {
                        (this.props.nodes && this.props.nodes.length) ? this.props.nodes.map((entry) => {
                          return (
                            <option value={entry.NodeId} key={entry.NodeId}>{entry.NodeName}</option>
                          )
                        })
                        :
                        <option/>
                      }
                    </select>
                  </label>
                  <label>Update intervall in milliseconds
                    <input type="number" defaultValue="5" ref="tolleranceInterval"/>
                  </label>
                  <input type="checkbox" ref="subscribe"/>
                  <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                </div>
              </div>
              <button className="button expanded" onClick={() => {this.setWidgetHandle()}}>Set Widget</button>
            </form>
          </div>
        }

      </ul>
    );
  }
}

export default Widget;
