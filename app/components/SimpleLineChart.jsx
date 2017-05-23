import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {LineChart} from 'react-d3';

class SimpleLineChart extends Component {

  componentDidMount() {}

  render() {
    return this.props.data.length
      ? (<LineChart data={[{
          name: "series",
          strokeWidth: 3,
          values: this.props.data || []
        }
      ]} width={500} height={300} viewBoxObject={{
        x: 0,
        y: 0,
        width: 600,
        height: 400
      }} title="Line Chart" xAxisLabel="Elapsed Time (ms)" gridHorizontal={true}/>)
      : (
        <div></div>
      )
  }
}

export default SimpleLineChart;
