import React, {Component} from 'react';

class Page extends Component {

  componentDidMount() {}

  render() {
    return (
      <div>
        {this.props.pages.map((entry) => {
          return (
            <li key={pageKey} className="list-group-item">
              <div className="handleGroupname">
                <div>
                  Rename
                </div>
                <div>
                  Delete
                </div>
              </div>
              <a>
                Page 1
              </a>
            </li>
          )
        })}
      </div>
    );
  }
}

export default Page;
