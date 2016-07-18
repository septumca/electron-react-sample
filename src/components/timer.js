(function () {
    const React = require('react');
    const {Dispatcher} = require('../dispatcher');
    const {PropStore} = require('../stores/properties');

    const dispatch_action = function(action_name) {
        Dispatcher.dispatch({
            eventName: action_name
        });
    };

    class Timer extends React.Component {
        constructor() {
            super();
            this._stateChanged = this._stateChanged.bind(this);
            this._roundChanged = this._roundChanged.bind(this);
            this._frequencyChanged = this._frequencyChanged.bind(this);
            this._timeChanged = this._timeChanged.bind(this);
            this._interruptsChanged = this._interruptsChanged.bind(this);
            this.handleClickStart = this.handleClickStart.bind(this);

            this.state = {
                time: 0,
                round: 0,
                text: 'Time left',
                frequency: 0,
                interrupts: 0,
                started: false
            }
        }

        componentDidMount() {
            PropStore.bind('change-state', this._stateChanged);
            PropStore.bind('change-frequency', this._frequencyChanged);
            PropStore.bind('change-time', this._timeChanged);
            PropStore.bind('change-round', this._roundChanged);
            PropStore.bind('change-interrupts', this._interruptsChanged);
        }

        componentWillUnmount() {
            PropStore.unbind('change-state', this._stateChanged);
            PropStore.unbind('change-frequency', this._frequencyChanged);
            PropStore.unbind('change-time', this._timeChanged);
            PropStore.unbind('change-round', this._roundChanged);
            PropStore.unbind('change-interrupts', this._interruptsChanged);
        }

        _stateChanged() {
            this.setState({text: PropStore.get_text()});
        }

        _roundChanged() {
            this.setState({round: PropStore.get_round()});
        }

        _frequencyChanged() {
            this.setState({frequency: PropStore.get_frequency()});
        }

        _timeChanged() {
            this.setState({time: PropStore.get_remaining_time()});
        }

        _interruptsChanged() {
            this.setState({interrupts: PropStore.get_interrupts()});
        }

        handleClickStart() {
            dispatch_action('start');
            this.setState({started: true});
        }

        handleClickInterrupt() {
            dispatch_action('interrupt');
        }

        handleClickSkip() {
            dispatch_action('skip');
        }

        render() {
            return (
                <div>
                    <button onClick={this.handleClickStart} disabled={this.state.started}>Start</button>
                    <button onClick={this.handleClickInterrupt} disabled={!this.state.started}>Interrupt</button>
                    <button onClick={this.handleClickSkip} disabled={!this.state.started}>Skip</button>
                    <div>Round: {this.state.round}</div>
                    <div>{this.state.text}: {this.state.time}</div>
                    <div>Frequency: {this.state.frequency}</div>
                    <div>Interrupts: {this.state.interrupts}</div>
                </div>
            );
        }
    }

    module.exports = {
        Timer
    };
}) ();