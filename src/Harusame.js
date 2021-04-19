const { EventEmitter } = require('events');
const HarusameSocket = require('./ws/HarusameSocket');
const Gateways = require('./ws/Gateways');

class Harusame extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            attempts: config.attempts || 3,
            interval: config.interval || 5000
        };
        this.ws = new Map();
        for (const { name, key, link } of Gateways) this.ws.set(key, new HarusameSocket(this, name, link));
    }

    get song() {
        const data = {};
        for (const [ key, socket ] of this.ws) data[key] = socket.data;
        return data;
    }

    connect(key) {
        const socket = this.ws.get(key.toUpperCase());
        if (!socket)
            throw new Error('The key parameter must be only JP or KR.');
        socket.start();
    }

    destroy(key) {
        const socket = this.ws.get(key.toUpperCase());
        if (!socket)
            throw new Error('The key parameter must be only JP or KR.');
        socket.destroy();
    }
}

module.exports = Harusame;
