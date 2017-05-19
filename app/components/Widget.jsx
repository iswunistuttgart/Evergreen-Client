import React, {Component} from 'react';
import SimpleLineChart from './SimpleLineChart';

class Widget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      configureFlag: false
    }
  }

  componentDidMount() {}

  render() {
    return (
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
          {this.props.widgetType === 'graph' &&
            <div>
              <div className="WidgetButton">
                Graph
              </div>
              <SimpleLineChart />
            </div>
          }
          {this.props.widgetType === 'toggle' &&
            <div>
              <div className="WidgetButton">
                Toggle Button
              </div>
              <div className="switch round large">
                <input id="exampleRadioSwitch3" type="radio" name="testGroup"/>
                <label htmlFor="exampleRadioSwitch3"></label>
              </div>
            </div>
          }
          {this.props.widgetType === 'lamp' &&
            <div className="LED">
              LED
              <div className="circle"></div>
            </div>
          }
          {this.props.widgetType === 'inputfield' &&
            <div>
              <div className="WidgetButton">
                Inputfield
              </div>
              <input type="search" placeholder="Value"/>
            </div>
          }
          {this.props.widgetType === 'outputfield' &&
            <div>
              <div className="WidgetButton">
                Outputfield
              </div>
              <input type="search" placeholder="Value"/>
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
                    <select>
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
                    <select>
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
                    <input type="number" defaultValue="5"/>
                  </label>
                  <input type="checkbox"/>
                  <label htmlFor="checkbox2">Activate Subscribe (Dataupdate)</label>
                </div>
              </div>
              <button className="button expanded" onClick={() => {this.setState({configureFlag: false})}}>Set Widget</button>
            </form>
          </div>
        }

      </ul>
    );
  }
}

export default Widget;
