const React = require('react');

class Timer extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      time: 5
    }
  }
  handleClick() {
    this.setState({time: this.state.time + 5});
  }
  render() {
    return (
      <div onClick={this.handleClick}>
        Time left: {this.state.time}
      </div>
    );
  }
}

module.exports = { 
    Timer: Timer
};