const Websocket = require('ws');
const HarusameSocketEvents = require('./HarusameSocketEvents');
class HarusameSocket {
    constructor(Harusame, WebsocketName, WebsocketURL) {
        this.harusame = Harusame;
        this.name = WebsocketName;
        this.url = WebsocketURL;

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
        this._heartbeatInterval = null;

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
        this.ws.on('close', HarusameSocketEvents.close.bind(this));
        this.ws.on('error', HarusameSocketEvents.error.bind(this));
        this.ws.on('open', HarusameSocketEvents.open.bind(this));
        this.ws.on('message',  HarusameSocketEvents.message.bind(this));
    }

    destroy() {
        if (!this.ws) return;
        this.ws.close(1000);
    }

    send(data) {
        return new Promise((resolve, reject) => {
            if (!this.ws) return resolve();
            let payload;
            try {
                payload = JSON.stringify(data);
            } catch (error) {
                return reject(error);
            }
            this.ws.send(payload, error => error ? reject(error) : resolve());
        });
    }

    _heartbeat(duration) {
        // duration provided
        if (!isNaN(duration)) {
            // check if heartbeatInterval is non-null before continuing
            if (this._heartbeatInterval) {
                clearInterval(this._heartbeatInterval);
                this._heartbeatInterval = null;
            }
            if (duration !== 1) {
                this._heartbeatInterval = setInterval(this._heartbeat.bind(this), duration);
            }
        }
        // duration not provided, send heartbeat instead
        else {
            this.send({ op: 9 })
                .then(() => this.harusame.emit('debug', this.name, 'Sent a heartbeat.'))
                .catch(HarusameSocketEvents.error.bind(this));
        }
    }
}

module.exports = HarusameSocket;
