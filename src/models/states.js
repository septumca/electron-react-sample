(function () {
    const interval_time_ms = 20;
    const ms_in_s = 1000;

    class TimerState{
        constructor(initial_time_ms) {
            this.time_ms = initial_time_ms;
            this.interval = null;
        }

        change_time(delta_ms) {
            this.time_ms = this.time_ms + delta_ms;
        };

        has_ended() {
            return this.time_ms <= 0;
        };

        start() {
            this.interval = setInterval(() => {
                this.change_time(-interval_time_ms)

                if (this.has_ended()) {
                    clearInterval(this.interval)
                }
            }, interval_time_ms);
        };
    };

    module.exports = {
        TimerState: TimerState
    }
}) ();


