(function () {
    const React = require('react');
    const {TimerState} = require('../models/states')

    class Timer extends React.Component {
      constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.state = {
          timer_state: new TimerState(3000)
        }
      }
      handleClick() {
        this.state.timer_state.start();
      }
      render() {
        return (
          <button onClick={this.handleClick}>Start</button>
        );
      }
    }

    module.exports = {
        Timer: Timer
    };
}) ();