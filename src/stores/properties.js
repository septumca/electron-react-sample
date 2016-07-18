(function () {
    const {Dispatcher} = require('../dispatcher');
    const MicroEvent = require('../microevent');

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 256; // value in hertz

    const _time_min_s = 30;
    const _time_max_s = 50;
    const _frequency_min = 200;
    const _frequency_max = 300;
    const _rest_time_min = 1;
    const _rest_time_start = 10;
    const _frequency_modifiers = [-1, 3, 5, 7]
    const _interval_time_ms = 20;
    const _ms_in_s = 1000;
    const _s_in_m = 60;
    const _note_length = 0.05 * _ms_in_s;

    let _frequency = _frequency_min;
    let _interrupts = 0;
    let _rest_time = 0;
    let _round = 0;
    let _act_timer_state = null;
    let _stored_timer_state = [];

    const _get_time = function() {
        return (Math.floor(Math.random() * (_time_max_s - _time_min_s + 1)) + _time_min_s) * _ms_in_s;
    };

    const _get_new_frequency = function() {
        let frequency_modifier = _frequency_modifiers[Math.floor(Math.random() * _frequency_modifiers.length)]
        let delta = frequency_modifier * _round
        let new_frequency = Math.min(_frequency + delta, _frequency_max); 
        _frequency = new_frequency
        PropStore.trigger('change-frequency');
    };

    class TimerState{
        constructor(initial_time_ms, text='Time remaining') {
            this.time_ms = initial_time_ms;
            this.interval = null;
            this.text = text;
        };

        change_time(delta_ms) {
            this.time_ms = this.time_ms + delta_ms;
            PropStore.trigger('change-time');
        };

        has_ended() {
            return this.time_ms <= 0;
        };

        on_time_changed(original_time, delta) {};
        on_has_ended() {
            this.stop();
        };

        start() {
            this.interval = setInterval(() => {
                let original_time = this.time_ms
                this.change_time(-_interval_time_ms)
                this.on_time_changed(original_time, -_interval_time_ms)

                if (this.has_ended()) {
                    this.on_has_ended();
                }
            }, _interval_time_ms);
        };

        stop() {
            clearInterval(this.interval);
        };
    };


    class BeepState extends TimerState {
        constructor(initial_time_ms) {
            super(initial_time_ms);
            _get_new_frequency();
            this.beep_interval_ms_base = (_ms_in_s * _s_in_m) / _frequency
            this.beep_interval_ms_act = this.beep_interval_ms_base

            _round = _round + 1;
            PropStore.trigger('change-round');
        };

        beep() {
            osc.connect(audioCtx.destination);
            setTimeout(() => {
                osc.disconnect(audioCtx.destination);
            }, _note_length);
        };

        on_time_changed(original_time_ms, delta_ms) {
            super.on_time_changed(original_time_ms, delta_ms);
            this.beep_interval_ms_act = this.beep_interval_ms_act + delta_ms;

            if(this.beep_interval_ms_act <= 0) {
                this.beep_interval_ms_act = this.beep_interval_ms_base
                this.beep();
            }
        };

        on_has_ended() {
            super.on_has_ended();
            set_state(new BeepState(_get_time()));
        };
    };

    class InterruptState extends TimerState {
        constructor(initial_time_ms) {
            super(initial_time_ms, 'Rest for');
            _interrupts = _interrupts + 1;
            PropStore.trigger('change-interrupts');
        };

        on_has_ended() {
            super.on_has_ended();
            let stored_state = _stored_timer_state.pop();
            set_state(stored_state);
        };
    };

    const set_state = function(state, do_store=false) {
        if(do_store) {
            _act_timer_state.stop();
            _stored_timer_state.push(_act_timer_state);
        }

        _act_timer_state = state;
        PropStore.trigger('change-state');
        _act_timer_state.start();
    };

    const handlers = {
        'start': function() {
            osc.start();
            set_state(new BeepState(_get_time()));
        },
        'interrupt': function() {
            set_state(new InterruptState(_get_time()), true);
        },
        'skip': function() {
            _act_timer_state.stop();
            set_state(new BeepState(_get_time()));
        }
    };

    const PropStore = {
        get_remaining_time: () => {
            return Math.floor(_act_timer_state.time_ms / _ms_in_s) + 1;
        },

        get_frequency: () => {
            return _frequency;
        },

        get_round: () => {
            return _round;
        },

        get_interrupts: () => {
            return _interrupts;
        },

        get_text: () => {
            return _act_timer_state.text;
        }
    };
    MicroEvent.mixin(PropStore);

    Dispatcher.register((payload) => {
        handlers[payload.eventName](payload);
    });

    module.exports = {
        PropStore
    };

}) ();