const { EventEmitter } = require('events');
const HarusameSocket = require('./ws/HarusameSocket');

class Harusame extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            attempts: config.attempts || 3,
            interval: config.interval || 5000
        };
        this.ws = {
            JPOP: new HarusameSocket(
                this,
                'Listen.moe JPOP',
                'wss://listen.moe/gateway_v2'
            ),
            KPOP: new HarusameSocket(
                this,
                'Listen.moe KPOP',
                'wss://listen.moe/kpop/gateway_v2'
            )
        };
    }

    get song() {
        return {
            JPOP: this.ws.JPOP.data,
            KPOP: this.ws.KPOP.data
        };
    }

    connect(socket) {
        if (!this.ws[socket])
            throw new Error('Socket parameter must be only JPOP or KPOP');
        this.ws[socket].start();
    }

    destroy(socket) {
        if (!this.ws[socket])
            throw new Error('Socket parameter must be only JPOP or KPOP');
        this.ws[socket].destroy();
    }
}

module.exports = Harusame;
