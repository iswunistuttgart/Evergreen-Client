import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import d3 from 'd3';
import Epoch from './EpochChart';

let data = [
  { label: 'Layer 1', values: [] }
];

class SimpleLineChart extends Component {

  componentDidMount() {
    this.areaChartInstance = $('#line' + this.props.id).epoch({
        type: 'time.line',
        data: data,
        axes: ['left', 'right', 'bottom']
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.areaChartInstance.push([{y: nextProps.value, time: ((new Date()).getTime() / 1000)|0}]);
    }
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div id={'line' + this.props.id} className="epoch category10" style={{height: '400px', width: '100%'}}></div>
    )
  }
}

export default SimpleLineChart;
