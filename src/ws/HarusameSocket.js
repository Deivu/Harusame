const Websocket = require('ws');
const { close, error, open, message } = require('./Events');
class HarusameSocket {
    constructor(harusame, name, url) {
        this.harusame = harusame;
        this.name = name;
        this.url = url;
        this.data = {
            songName: 'None',
            songArtist: 'None',
            songRequest: 'None',
            songAlbum: 'None',
            songCover: 'https://listen.moe/public/images/icons/apple-touch-icon.png',
            listeners: 0
        };
        this.attempts = 0;
        this.ws = null;
        this.heartbeatInterval = null;
        this.start();
    }

    start() {
        if (this.attempts > this.harusame.config.attempts) {
            this.harusame.emit('disconnect', this.name, 'Exceeded the maximum reconnect attempts. Please reconnect manually');
            this.attempts = 0;
            return;
        }
        if (this.ws) return;
        this.ws = new Websocket(this.url);
        this.ws.on('close', close.bind(this));
        this.ws.on('error', error.bind(this));
        this.ws.on('open', open.bind(this));
        this.ws.on('message', message.bind(this));
    }

    destroy() {
        if (!this.ws || this.ws.readyState !== Websocket.OPEN) return close.bind(this)(1000);
        this.ws.close(1000);
    }

    send(data) {
        if (!this.ws || this.ws.readyState !== Websocket.OPEN) return;
        this.ws.send(JSON.stringify(data), error => {
            if (error) this.harusame.emit('error', this.name, error);
        });
    }

    _heartbeat(duration) {
        // duration provided
        if (!isNaN(duration)) {
            // check if heartbeatInterval is non-null before continuing
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
                this.heartbeatInterval = null;
            }
            if (duration >= 0) {
                this.heartbeatInterval = setInterval(this._heartbeat.bind(this), duration);
            }
        }
        // duration not provided, send heartbeat instead
        else {
            this.send({ op: 9 });
            this.harusame.emit('debug', this.name, 'Sent a heartbeat.');
        }
    }
}

module.exports = HarusameSocket;
