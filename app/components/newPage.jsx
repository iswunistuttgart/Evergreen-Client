import React, {Component} from 'react';
import axios from 'axios';
import Widget from './Widget';
const io = require('socket.io-client');
const socket = io();
import AsyncWaterfall from 'async-waterfall';
// import { Responsive, WidthProvider } from 'react-grid-layout';
// const ResponsiveReactGridLayout = WidthProvider(Responsive);
import _ from 'lodash';
require('./packery');
import Draggabilly from './draggabilly';

let isMobileFn = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

class newPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      names: [],
      nodes: [],
      widgets: [],
      widgetselect: 'graph',
      page: {},
      username: '',
      order: [],
      childsNeededToLoad: 0,
      isEveryChildLoaded: false,
      isMobile: false
    }
  }

  componentDidMount() {

    // let elem = document.querySelector('.grid');
    // let pckry = new Packery( elem, {
    //   // options
    //   itemSelector: '.grid-item',
    //   gutter: 20,
    //   percentPosition: true
    // });

    if (isMobileFn()) {
      this.setState({
        isMobile: true
      })
    }

    this.setState({username: window.sessionStorage.getItem("username")})

    axios.post('/rest/page/get', {session: window.sessionStorage.getItem("session"), page: this.props.params.pageId}).then((page) => {

      if (page.data.Id) {
        this.setState({
          page: {Id: page.data.Id, Title: page.data.Title, CreatorId: page.data.CreatorId},
          widgets: page.data.widgets
        }, () => {
          setTimeout(() => {

            this.grid = $('.grid').packery({
              itemSelector: '.grid-item',
              columnWidth: '.grid-sizer',
              gutter: '.gutter-sizer',
              percentPosition: true
            });

            if (!this.state.isMobile) {
              this.grid.find('.grid-item').each( ( i, gridItem ) => {
                let draggie = new Draggabilly( gridItem );
                // bind drag events to Packery
                this.grid.packery( 'bindDraggabillyEvents', draggie );
              });
              let tArray = []

              this.grid.on( 'dragItemPositioned', ( event, draggedItem ) => {
                this.grid.packery('getItemElements').forEach((entry) => {
                  tArray.push(parseInt($(entry).attr("data-gridkey")));
                })
                this.setState({order: tArray}, () => {
                  this.pageUpdate(true);
                });
              })
            }
          })
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

  componentWillUnmount () {
    socket.emit('disconnect_all');
    socket.removeAllListeners("subscription_result");
  }

  // onLayoutChange = (layout, layouts) => {
  //   // console.log('aaaa');
  //   // let tempArray = [];
  //   //
  //   // layout.map((entry, key) => {
  //   //   if (entry.minH === undefined) {
  //   //     tempArray.push(key);
  //   //   }
  //   // });
  //   //
  //   // if (tempArray.length) {
  //   //
  //   //   let tempObject = {};
  //   //   tempObject[this.state.breakpoint] = [];
  //   //
  //   //   layouts[this.state.breakpoint].map((entry) => {
  //   //     if (entry.minH === undefined) {
  //   //       entry.h = 15;
  //   //       entry.minH = 7;
  //   //     }
  //   //
  //   //     tempObject[this.state.breakpoint].push(entry);
  //   //   })
  //   //   // console.log('aaaa',  Object.assign({}, layouts, tempObject));
  //   //
  //   //   this.setState({
  //   //     layouts: Object.assign({}, layouts, tempObject)
  //   //   })
  //   // }
  //
  //   this.setState({layouts: layouts}, () => {
  //     this.pageUpdate();
  //   });
  // }

  // onBreakpointChange = (newBreakpoint, newCols) => {
  //   this.setState({breakpoint: newBreakpoint});
  // }

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
              socket.emit('subscribe', {contextId: entry.contextId, tolleranceInterval: parseInt(entry.config.tolleranceInterval || 200), session: window.sessionStorage.getItem("session")});
              callback();
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
      if (!this.state.isMobile) {
        this.grid.find('.grid-item').each( ( i, gridItem ) => {
          if (i === this.grid.find('.grid-item').length - 1) {
            let draggie = new Draggabilly( gridItem );
            // bind drag events to Packery
            this.grid.packery( 'bindDraggabillyEvents', draggie );
          }
        });
      }
    })
  }

  pageUpdate = (flag) => {
    let tempString = window.btoa(JSON.stringify({widgets: this.state.widgets, order: this.state.order}));
    // let tempString = window.btoa(JSON.stringify(this.state.widgets));
    if (!flag) {
      this.gridLayout();
    }

    axios.post('/rest/page/update', {session: window.sessionStorage.getItem("session"), page: {Id: this.props.params.pageId, CreatorId: this.state.page.CreatorId, Title: this.state.page.Title, ConfigXML: tempString}})
      .then((result) => {

      })
      .catch((e) => {
        console.error('cc', e);
      })
  }

  gridLayout = () => {
    setTimeout(() => {
      this.grid.packery('reloadItems')
      this.grid.packery('layout');
    }, 10)
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
      this.context.router.push('#')
    }).catch((e) => {})
  }

  backHandler = () => {
    history.back();
  }

  render() {
    return (
      <main>
        <page-top>
          <div className="page-top clearfix">
            <div className="left-button" onClick={this.backHandler}>
              <span className="button-wrapper">
                <i className="glyphicon glyphicon-menu-left"></i>
              </span>
            </div>
            <a href="/" className="al-logo clearfix">
              <span>Ever</span>
              Green
            </a>
            <div className="user-name" style={{
                marginLeft: '25px',
                color: '#ffffff',
                fontSize: '24px',
                whiteSpace: 'nowrap',
                float: 'left',
                lineHeight: '60px'}}>
              <span>{this.state.username}</span>
            </div>
            <div className="logoutWrapper">
              <a href onClick={this.logoutHandler}>Logout</a>
            </div>
            <div className="page-top-search">
              <div className="input-group">
                <select name="widgetselect" className="form-control" onKeyPress={
                            (event) => {
                              if (event.key == 'Enter') {
                                this.addWidget();
                              }
                            }
                    } onChange={this.handleInputChange}>
                  <option value="graph">Graph</option>
                  <option value="toggle">Toggle Button</option>
                  <option value="lamp">LED</option>
                  <option value="inputfield">Inputfield</option>
                  <option value="outputfield">Outputfield</option>
                </select>
                <span className="input-group-btn">
                  <button className="btn btn-primary stand-still" onClick={this.addWidget}  type="button">Add Widget</button>
                </span>
              </div>
            </div>
          </div>
        </page-top>
        <div className="al-main">
          <div className="al-content">
            <content-top>
              <div className="content-top clearfix">
                <h1 className="al-title ng-binding">{this.state.page.Title}</h1>
              </div>
            </content-top>
            <div>
              <div className="widgets">
                {/* <pre>
                  {JSON.stringify(this.state, false, 2)}
                </pre> */}
                {/* <ResponsiveReactGridLayout className="layout" layouts={this.state.layouts}
                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                  useCSSTransforms={true}
                  onLayoutChange={this.onLayoutChange}
                  onBreakpointChange={this.onBreakpointChange}
                  rowHeight={5}
                  autoSize={true}
                  cols={{lg: 3, md: 3, sm: 2, xs: 1, xxs: 1}}>
                  {this.state.widgets && this.state.widgets.map((entry, key) => {
                    return (
                      <div key={entry.contextId} data-grid={this.state.grid}>
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
                      </div>
                    )
                  })}
                </ResponsiveReactGridLayout> */}
                <div className="grid">
                  <div className="grid-sizer"></div>
                  <div className="gutter-sizer"></div>
                  {this.state.widgets && this.state.widgets.map((entry, key) => {
                    return (
                      // <div key={key} className="grid-item">
                      //   <div style={{height: '50px', backgroundColor: '#ccc'}}></div>
                      // </div>
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
                        gridLayout={this.gridLayout}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )

    // return (
    //   <div>
    //     <div className="top-bar">
    //       <div className="top-bar-left">
    //         <ul className="menu">
    //           <li className="menu-text">Username</li>
    //           <li>
    //             <a onClick={this.logoutHandler}>Logout</a>
    //           </li>
    //         </ul>
    //       </div>
    //       <div className="top-bar-right">
    //         <form>
    //           <ul className="menu">
    //             <li>
    //               <select name="widgetselect" onChange={this.handleInputChange}>
    //                 <option value="graph">Graph</option>
    //                 <option value="toggle">Toggle Button</option>
    //                 <option value="lamp">LED</option>
    //                 <option value="inputfield">Inputfield</option>
    //                 <option value="outputfield">Outputfield</option>
    //               </select>
    //             </li>
    //             <li>
    //               <input type="button" className="button" onClick={this.addWidget} value="Add Widget"/>
    //             </li>
    //           </ul>
    //         </form>
    //       </div>
    //     </div>
    //     <div className="flex-container">
    //       {/* <pre>{JSON.stringify(this.state, false, 2)}</pre> */}
    //       {this.state.widgets && this.state.widgets.map((entry, key) => {
    //         return (
    //           <Widget
    //             key={entry.contextId}
    //             id={entry.contextId}
    //             keyindex={key}
    //             subscribe={this.subscribe}
    //             valueChange={this.handleValueChange}
    //             readVariable={this.readVariable}
    //             writeVariable={this.writeVariable}
    //             widgetType={entry.widgetType}
    //             names={this.state.names}
    //             nodes={this.state.nodes}
    //             value={entry.value}
    //             config={entry.config}
    //             setConfig={this.setConfig}
    //             pageUpdate={this.pageUpdate}
    //             delete={this.deletePage}
    //             setTitle={this.setTitle}
    //             title={entry.title}
    //           />
    //         )
    //       })
    //       }
    //     </div>
    //   </div>
    //
    // );
  }
}

newPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default newPage;
