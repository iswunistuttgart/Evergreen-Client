import React, {Component} from 'react';
import axios from 'axios';
import Home_Nav from './Home_Nav';
import Page from './Page';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupInputFlag: null,
      pageCreateInputFlag: null,
      pageEditInputFlag: null,
    }
  }

  componentDidMount() {
    axios.post('/rest/pageconfig/get', {session: window.sessionStorage.getItem("session")}).then((userPageConfig) => {
      console.log('aa', userPageConfig.data);
      this.setState({groups: userPageConfig.data.Groups, ownerId: userPageConfig.data.OwnerId})
    }).catch((err) => {
      console.error('err', err);
    })
  }

  renameHandler = (index) => {
    if (this.refs['groupInput' + index].value) {
      this.setState(Object.assign({}, this.state, {
        groups: [
          ...this.state.groups.slice(0, index),
          Object.assign({}, this.state.groups[index], {
            Title: this.refs['groupInput' + index].value
          }),
          ...this.state.groups.slice(index + 1)
        ],
        groupInputFlag: null
      }), () => {
        this.saveChange();
      })
    } else {
      this.setState({groupInputFlag: null});
    }
  }

  deleteHandler = (index) => {
    this.setState(Object.assign({}, this.state, {
      groups: [
        ...this.state.groups.slice(0, index),
        ...this.state.groups.slice(index + 1)
      ]
    }), () => {
      this.saveChange();
    })
  }

  createHandler = (name) => {
    let tempindex = 0;
    this.state.groups.map((entry) => {
      if (parseInt(entry.Index) > tempindex) {
        tempindex = parseInt(entry.Index);
      }
    })
    tempindex++;
    this.setState(Object.assign({}, this.state, {
      groups: [
        ...this.state.groups,
        {Title: name, Index: tempindex.toString()}
      ]
    }), () => {
      this.saveChange();
    })
  }

  deleteFunction = (pageId) => {

    let tempGroups = JSON.parse(JSON.stringify(this.state.groups));

    this.state.groups.map((entry, index) => {
      if (Object.prototype.toString.call( entry.Pages ) === '[object Object]') {
        tempGroups[index].Pages = entry.Pages.Id.toString();
      } else if (Object.prototype.toString.call( entry.Pages ) === '[object Array]') {
        tempGroups[index].Pages = [];
        entry.Pages.map((page) => {
          tempGroups[index].Pages.push(page.Id.toString())
        })
      } else {
        // delete tempGroups[index].Pages
      }
    })

    axios.post('/rest/pageconfig/update', {session: window.sessionStorage.getItem("session"), config: {OwnerId: this.state.ownerId, Groups: tempGroups}})
      .then(() => {
        axios.post('/rest/page/delete', {session: window.sessionStorage.getItem("session"), pageId: pageId})
          .then((result) => {
          })
          .catch((error) => {
            console.error('error occured', error);
          })
      })
      .catch((err) => {
        console.error('error occured', err);
      })
  }

  editFunction = (page) => {
    axios.post('/rest/page/update', {session: window.sessionStorage.getItem("session"), page: page})
      .then((result) => {

      })
      .catch((error) => {
        console.error('error occured', error);
      })
  }

  pageDeleteHandler = (index, pageIndex) => {
    if (pageIndex || pageIndex === 0) {
      let pageId = this.state.groups[index].Pages[pageIndex].Id;
      if (this.state.groups[index].Pages.length > 2) {
        this.setState(Object.assign({}, this.state, {
          groups: [
            ...this.state.groups.slice(0, index),
            Object.assign({}, this.state.groups[index], {
              Pages: [
                ...this.state.groups[index].Pages.slice(0, pageIndex),
                ...this.state.groups[index].Pages.slice(pageIndex + 1)
              ]
            }),
            ...this.state.groups.slice(index + 1)
          ]
        }), () => {
          this.deleteFunction(pageId)
        })
      } else if (this.state.groups[index].Pages.length === 2) {
        let otherIndex = pageIndex === 1 ? 0 : 1;
        this.setState(Object.assign({}, this.state, {
          groups: [
            ...this.state.groups.slice(0, index),
            Object.assign({}, this.state.groups[index], {
              Pages: this.state.groups[index].Pages[otherIndex]
            }),
            ...this.state.groups.slice(index + 1)
          ]
        }), () => {
          this.deleteFunction(pageId)
        })
      } else if (this.state.groups[index].Pages.length === 1) {
        this.setState(Object.assign({}, this.state, {
          groups: [
            ...this.state.groups.slice(0, index),
            Object.assign({}, this.state.groups[index], {
              Pages: null
            }),
            ...this.state.groups.slice(index + 1)
          ]
        }), () => {
          this.deleteFunction(pageId)
        })
      }
    } else {
      let pageId = this.state.groups[index].Pages.Id;
      this.setState(Object.assign({}, this.state, {
        groups: [
          ...this.state.groups.slice(0, index),
          Object.assign({}, this.state.groups[index], {
            Pages: null
          }),
          ...this.state.groups.slice(index + 1)
        ]
      }), () => {
        this.deleteFunction(pageId)
      })
    }
  }

  pageCreateHandler = (index) => {

    let title = this.refs['pageCreateInput' + index].value;
    if (title) {
      axios.post('/rest/page/add', {session: window.sessionStorage.getItem("session"), page: {Title: title, ConfigXML: ''}})
      .then((result) => {
        if (Object.prototype.toString.call( this.state.groups[index].Pages ) === '[object Object]') {
          this.setState(Object.assign({}, this.state, {
            groups: [
              ...this.state.groups.slice(0, index),
              Object.assign({}, this.state.groups[index], {
                Pages: [
                  this.state.groups[index].Pages,
                  {Title: title, Id: result.data.PageId, ConfigXML: ''}
                ]
              }),
              ...this.state.groups.slice(index + 1)
            ],
            pageCreateInputFlag: null
          }), () => {
            this.refs['pageCreateInput' + index].value = '';
            this.saveChange(true);
          })
        } else if (Object.prototype.toString.call( this.state.groups[index].Pages ) === '[object Array]') {
          this.setState(Object.assign({}, this.state, {
            groups: [
              ...this.state.groups.slice(0, index),
              Object.assign({}, this.state.groups[index], {
                Pages: [
                  ...this.state.groups[index].Pages,
                  {Title: title, Id: result.data.PageId, ConfigXML: ''}
                ]
              }),
              ...this.state.groups.slice(index + 1)
            ],
            pageCreateInputFlag: null
          }), () => {
            this.refs['pageCreateInput' + index].value = '';
            this.saveChange(true);
          })
        } else {
          this.setState(Object.assign({}, this.state, {
            groups: [
              ...this.state.groups.slice(0, index),
              Object.assign({}, this.state.groups[index], {
                Pages: {Title: title, Id: result.data.PageId, ConfigXML: ''}
              }),
              ...this.state.groups.slice(index + 1)
            ],
            pageCreateInputFlag: null
          }), () => {
            this.refs['pageCreateInput' + index].value = '';
            this.saveChange(true);
          })
        }
      })
      .catch((err) => {
        console.error('error occured', err);
      })
    } else {
      this.setState({pageCreateInputFlag: null});
    }
  }

  pageCreateToggle = (index) => {
    this.setState({pageCreateInputFlag: index});
  }

  pageEditHandler = (index, pageIndex, page) => {

    if (pageIndex || pageIndex === 0) {
      let title = this.refs['pageEditInput' + index + 'arr' + pageIndex].value;
      if (title) {
        this.setState(Object.assign({}, this.state, {
          groups: [
            ...this.state.groups.slice(0, index),
            Object.assign({}, this.state.groups[index], {
              Pages: [
                ...this.state.groups[index].Pages.slice(0, pageIndex),
                Object.assign({}, this.state.groups[index].Pages[pageIndex], {
                  Title: title
                }),
                ...this.state.groups[index].Pages.slice(pageIndex + 1)
              ]
            }),
            ...this.state.groups.slice(index + 1)
          ],
          pageEditInputFlag: null
        }), () => {
          this.editFunction(this.state.groups[index].Pages[pageIndex]);
        })
      } else {
        this.setState({pageEditInputFlag: null});
      }
    } else {
      let title = this.refs['pageEditInput' + index].value;
      if (title) {
        this.setState(Object.assign({}, this.state, {
          groups: [
            ...this.state.groups.slice(0, index),
            Object.assign({}, this.state.groups[index], {
              Pages: Object.assign({}, this.state.groups[index].Pages, {
                Title: title
              })
            }),
            ...this.state.groups.slice(index + 1)
          ],
          pageEditInputFlag: null
        }), () => {
          this.editFunction(this.state.groups[index].Pages);
        })
      } else {
        this.setState({pageEditInputFlag: null});
      }
    }
  }

  saveChange = (flag) => {

    let tempGroups = JSON.parse(JSON.stringify(this.state.groups));

    this.state.groups.map((entry, index) => {
      if (Object.prototype.toString.call( entry.Pages ) === '[object Object]') {
        tempGroups[index].Pages = entry.Pages.Id.toString();
      } else if (Object.prototype.toString.call( entry.Pages ) === '[object Array]') {
        tempGroups[index].Pages = [];
        entry.Pages.map((page) => {
          tempGroups[index].Pages.push(page.Id.toString())
        })
      } else {
        // delete tempGroups[index].Pages
      }
    })


    axios.post('/rest/pageconfig/update', {session: window.sessionStorage.getItem("session"), config: {OwnerId: this.state.ownerId, Groups: tempGroups}})
      .then(() => {
        if (flag) {
          axios.post('/rest/pageconfig/get', {session: window.sessionStorage.getItem("session")}).then((userPageConfig) => {
            this.setState({groups: userPageConfig.data.Groups, ownerId: userPageConfig.data.OwnerId})
          }).catch((err) => {})
        }
      })
      .catch((err) => {
        console.error('error occured', err);
      })
  }

  render() {
    return (
      <main>
        <Home_Nav createHandler={this.createHandler} router={this.context.router}/>
        <div className="al-main">
          <div className="al-content">
            <content-top>
              <div className="content-top clearfix">
                <h1 className="al-title ng-binding">Home</h1>
              </div>
            </content-top>
            <div>
              <div className="widgets">
                <div className="row">
                  {this.state.groups && this.state.groups.map((entry, index) => {
                    return (
                      <div className="col-lg-4 col-md-6" key={entry.Index}>
                        <div>
                          <div className="panel panel-blur animated">
                            <div className="panel-heading clearfix">
                              <div className="col-sm-6" style={{padding: 0}}>
                                {this.state.groupInputFlag === index
                                  ? <input ref={`groupInput${index}`} type="text" defaultValue={entry.Title} className="form-control" style={{margin: '5px'}}/>
                                  : <h3 className="panel-title">{entry.Title}</h3>
                                }
                              </div>
                              <div className="col-sm-6" style={{padding: '5px', paddingRight: '22px'}}>
                                {this.state.groupInputFlag === index
                                  ? <button className="btn btn-default pull-right" onClick={() => {this.setState({groupInputFlag: null})}}>Cancel</button>
                                  : <button className="btn btn-danger pull-right" onClick={() => {this.deleteHandler(index)}}>Delete</button>
                                }
                                {this.state.groupInputFlag === index
                                  ? <button className="btn btn-primary pull-right" style={{marginRight: '5px'}} onClick={() => {this.renameHandler(index)}}>Save</button>
                                  : <button className="btn btn-default pull-right" style={{marginRight: '5px'}} onClick={() => {this.setState({groupInputFlag: index})}}>Rename</button>
                                }

                              </div>
                            </div>
                            <div className="panel-body">
                              <div className="add-row-editable-table">
                                {/* <div className="col-md-6"> */}
                                  <div className="input-group">
                                    <input type="text" ref={`pageCreateInput${index}`}  className="form-control" placeholder="Sitename"/>
                                    <span className="input-group-btn">
                                      <button className="btn btn-primary stand-still" onClick={() => this.pageCreateHandler(index)} type="button">Add new site</button>
                                    </span>
                                  </div>
                                {/* </div> */}
                                { entry.Pages && Object.prototype.toString.call( entry.Pages ) === '[object Array]' &&
                                  <table className="table table-hover" style={{marginTop: '20px'}}>
                                    <tbody>
                                      { entry.Pages.map((page, pageIndex) => {
                                        return (
                                          <tr key={pageIndex}>
                                            <td>
                                              { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === pageIndex)
                                                ? <input className="form-control input-xs" ref={`pageEditInput${index}arr${pageIndex}`} type="text" defaultValue={page.Title}/>
                                                : <a style={{color: '#fff'}} href={'#/newPage/' + page.Id}>{page.Title}</a>
                                              }
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                              { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === pageIndex)
                                                ? <div>
                                                  <button className="btn btn-primary btn-xs" style={{marginRight: '5px'}} onClick={() => this.pageEditHandler(index, pageIndex, page)}>Save</button>
                                                  <button className="btn btn-default btn-xs" onClick={() => {this.setState({pageEditInputFlag: null})}}>Cancel</button>
                                                </div>
                                                : <div>
                                                  <button className="btn btn-default btn-xs" style={{marginRight: '5px'}} onClick={() => {this.setState({pageEditInputFlag: {index: index, pageIndex: pageIndex}})}}>Rename</button>
                                                  <button className="btn btn-danger btn-xs" onClick={() => {this.pageDeleteHandler(index, pageIndex)}}>Delete</button>
                                                </div>
                                              }
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                }
                                { entry.Pages && Object.prototype.toString.call( entry.Pages ) === '[object Object]' &&
                                <table className="table table-hover" style={{marginTop: '20px'}}>
                                  <tbody>
                                    <tr>
                                      <td>
                                        { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === null)
                                          ? <input className="form-control input-xs" ref={`pageEditInput${index}`} type="text" defaultValue={entry.Pages.Title}/>
                                          : <a style={{color: '#fff'}} href={'#/newPage/' + entry.Pages.Id}>{entry.Pages.Title}</a>
                                        }
                                      </td>
                                      <td style={{textAlign: 'right'}}>
                                        { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === null)
                                          ? <div>
                                            <button className="btn btn-primary btn-xs" style={{marginRight: '5px'}} onClick={() => this.pageEditHandler(index, null, entry.Pages)}>Save</button>
                                            <button className="btn btn-default btn-xs" onClick={() => {this.setState({pageEditInputFlag: null})}}>Cancel</button>
                                          </div>
                                          : <div>
                                            <button className="btn btn-default btn-xs" style={{marginRight: '5px'}} onClick={() => {this.setState({pageEditInputFlag: {index: index, pageIndex: null}})}}>Rename</button>
                                            <button className="btn btn-danger btn-xs" onClick={() => {this.pageDeleteHandler(index)}}>Delete</button>
                                          </div>
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
    //     <Home_Nav createHandler={this.createHandler} router={this.context.router}/>
    //     {/* <pre>{JSON.stringify(this.state.groups, false, 2)}</pre> */}
    //     <ul className="flex-container">
    //       {this.state.groups && this.state.groups.map((entry, index) => {
    //         return (
    //           <li key={entry.Index} className="flex-item">
    //             <ul className="list-group">
    //               <li className="list-group-item active">
    //                 <div className="handleGroupname">
    //                   <button onClick={() => {this.setState({groupInputFlag: index})}}>
    //                     Rename
    //                   </button>
    //                   <button onClick={() => {this.deleteHandler(index)}}>
    //                     Delete
    //                   </button>
    //                 </div>
    //                 { this.state.groupInputFlag === index ?
    //                   <div>
    //                     <input ref={`groupInput${index}`} type="text" defaultValue={entry.Title}/>
    //                     <button type="submit" onClick={() => this.renameHandler(index)}>Save</button>
    //                   </div>
    //                   :
    //                   <span>{entry.Title}</span>
    //                 }
    //               </li>
    //               { entry.Pages && Object.prototype.toString.call( entry.Pages ) === '[object Array]' && entry.Pages.map((page, pageIndex) => {
    //                 return (
    //                   <li key={pageIndex} className="list-group-item">
    //                     <div className="handleGroupname">
    //                       <button onClick={() => {this.setState({pageEditInputFlag: {index: index, pageIndex: pageIndex}})}}>
    //                         Rename
    //                       </button>
    //                       <button onClick={() => {this.pageDeleteHandler(index, pageIndex)}}>
    //                         Delete
    //                       </button>
    //                     </div>
    //                     { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === pageIndex) ?
    //                       <div>
    //                         <input ref={`pageEditInput${index}arr${pageIndex}`} type="text" defaultValue={page.Title}/>
    //                         <button type="submit" onClick={() => this.pageEditHandler(index, pageIndex, page)}>Save</button>
    //                       </div>
    //                       :
    //                       <a href={'#/newPage/' + page.Id}>{page.Title}</a>
    //                     }
    //                   </li>
    //                 )
    //               })}
    //
    //               { entry.Pages && Object.prototype.toString.call( entry.Pages ) === '[object Object]' &&
    //                 <li className="list-group-item">
    //                   <div className="handleGroupname">
    //                     <button onClick={() => {this.setState({pageEditInputFlag: {index: index, pageIndex: null}})}}>
    //                       Rename
    //                     </button>
    //                     <button onClick={() => {this.pageDeleteHandler(index)}}>
    //                       Delete
    //                     </button>
    //                   </div>
    //                   { (this.state.pageEditInputFlag && this.state.pageEditInputFlag.index === index && this.state.pageEditInputFlag.pageIndex === null) ?
    //                     <div>
    //                       <input ref={`pageEditInput${index}`} type="text" defaultValue={entry.Pages.Title}/>
    //                       <button type="submit" onClick={() => this.pageEditHandler(index, null, entry.Pages)}>Save</button>
    //                     </div>
    //                     :
    //                     <a href={'#/newPage/' + entry.Pages.Id}>{entry.Pages.Title}</a>
    //                   }
    //                 </li>
    //               }
    //               { this.state.pageCreateInputFlag === index ?
    //                 <div>
    //                   <input ref={`pageCreateInput${index}`} type="text"/>
    //                   <button type="submit" onClick={() => this.pageCreateHandler(index)}>Save</button>
    //                 </div>
    //                 :
    //                 <button className="dropdown button" type="button" onClick={() => {this.pageCreateToggle(index)}}>Add new site</button>
    //               }
    //             </ul>
    //           </li>
    //         )
    //       })}
    //
    //       {/* <li className="flex-item">
    //         <ul className="list-group">
    //           <li className="list-group-item active">Groupname</li>
    //           <button className="dropdown button" type="button">Add new site</button>
    //
    //           <div className="large-12 columns">
    //             <label>
    //               <input name="addServerName" type="text" placeholder="Sitename" onChange={this.handleInputChange}/>
    //             </label>
    //           </div>
    //           <button type="button" className="button expanded" onClick={this.addServer}>Add new site</button>
    //
    //         </ul>
    //       </li> */}
    //     </ul>
    //   </div>
    // );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Home;
