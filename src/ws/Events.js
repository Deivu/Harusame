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
                        songName: d.song.title ? d.song.title : 'None',
                        songArtist: d.song.artists.length ? d.song.artists.map(a => a.nameRomaji || a.name).join(', ') : 'None',
                        songRequest: d.requester ? d.requester.displayName : 'None',
                        songAlbum: d.song.albums && d.song.albums.length > 0 ? d.song.albums[0].name : 'None',
                        songCover: d.song.albums && d.song.albums.length > 0 && d.song.albums[0].image ? `https://cdn.listen.moe/covers/${d.song.albums[0].image}` : 'https://listen.moe/images/share.jpg',
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
