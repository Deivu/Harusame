const { EventEmitter } = require('events');
const HarusameSocket = require('./ws/HarusameSocket');
const Gateways = require('./ws/HarusameGateways');

class Harusame extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            attempts: config.attempts || 3,
            interval: config.interval || 5000
        };

        Object.defineProperty(this, 'ws', { value: new Map() });
        for (const { name, key, link } of Gateways) this.ws.set(key, new HarusameSocket(this, name, link));
    }

    get song() {
        const data = {};
        for (const [key, socket] of this.ws) data[key] = socket.data;
        return data;
    }

    connect(key) {
        const socket = this.ws.get(key);
        if (!socket)
            throw new Error('The key parameter must be only JP or KR. Case Sensitive');
        socket.start();
    }

    destroy(key) {
        const socket = this.ws.get(key);
        if (!socket)
            throw new Error('The key parameter must be only JP or KR. Case Sensitive');
        socket.destroy();
    }
}

module.exports = Harusame;
