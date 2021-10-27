const Websocket = require('ws');

class Events {
    static close(code, reason) {
        this._heartbeat(-1);
        this.ws?.removeAllListeners();
        if (this.ws?.readyState === Websocket.OPEN) this.ws.close(code);
        this.ws = null;
        this.harusame.emit('close', this.name, code, reason);
        if (code !== 1000) return setTimeout(this.start.bind(this), this.harusame.config.interval);
        this.attempts = 0;
        this.harusame.emit('disconnect', this.name, 'Socket disconnected with close code 1000, please reconnect manually');
    }

    static error(error) {
        this.harusame.emit('error', this.name, error);
        if (!this.ws) return Events.close.bind(this)(1011, 'Websocket errored');
        if (this.ws.readyState === Websocket.OPEN) this.ws.close(1011);
    }
    
    static open() {
        this._heartbeat(-1);
        this.harusame.emit('open', this.name);
    }

    static message(string) {
        try {
            const msg = JSON.parse(string);
            const defaultImage = 'https://listen.moe/images/share.jpg';

            switch (msg.op) {
                case 0: {
                    this.attempts = 0;
                    this._heartbeat(msg.d.heartbeat);
                    this.harusame.emit('debug', this.name, `Set to heartbeat every ${msg.d.heartbeat} ms`);
                    this.harusame.emit('ready', this.name);
                    break;
                }
                case 1: {
                    if (msg.t !== 'TRACK_UPDATE' && msg.t !== 'TRACK_UPDATE_REQUEST' && msg.t !== 'QUEUE_UPDATE' && msg.t !== 'NOTIFICATION') break;
                    if (!msg.d) break;
                    const { d } = msg;
                    if (!d.song) break;
                    this.data = {
                        id: d.song.id || 0,
                        name: d.song.title || 'none',
                        artists: d.song.artists ? d.song.artists.map((a) => ({ ...a, image: a.image ? `https://cdn.listen.moe/artist/${a.image}` : defaultImage })) : [],
                        requester: d.requester ? d.requester.displayName : 'none',
                        albums: d.song.albums ? d.song.albums.map((a) => ({ ...a, image: a.image ? `https://cdn.listen.moe/albums/${a.image}` : defaultImage })) : [],
                        cover: d.song.albums && d.song.albums.length > 0 && d.song.albums[0].image ? `https://cdn.listen.moe/covers/${d.song.albums[0].image}` : defaultImage,
                        duration: d.song.duration || 0,
                        listeners: d.listeners || 0
                    };
                    this.harusame.emit('songUpdate', this.name, this.data);
                    break;
                }
                case 10:
                    this.harusame.emit('debug', this.name, 'Heartbeat acknowledged.');
    
            }
        } catch (error) {
            this.harusame.emit('error', this.name, error);
        }
    }
}

module.exports = Events;
