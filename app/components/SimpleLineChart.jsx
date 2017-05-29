import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import d3 from 'd3';
require('./flot');
require('./flottime');

class SimpleLineChart extends Component {

  componentDidMount() {
		// We use an inline data source in the example, usually data would
		// be fetched from a server

    this.data = [];

		this.plot = $.plot("#flotplaceholder" + this.props.id, [ this.data ], {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
			},
			yaxis: {
				show: true
			},
			xaxis: {
				mode: "time",
        timeformat: "%H:%M:%S",
        show: true,
        timezone: 'browser'
			},
      grid: {
        hoverable: true,
        clickable: true
      }
		});

    this.myInterval = setInterval(() => {
      this.plot.setData([this.data])
      this.plot.setupGrid();

      this.plot.draw();
    }, 100)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (this.data.length > 100) {
        this.data.shift();
      }
      let newDate = (new Date()).getTime();
      this.data.push([newDate, nextProps.value])
    }
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    return (
      <div>
        <div id={'flotplaceholder' + this.props.id} style={{width: '100%', height: '400px'}}></div>
      </div>
    )
  }
}

export default SimpleLineChart;
