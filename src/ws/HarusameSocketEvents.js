class HarusameSocketEvents {
    static close(code, reason) {
        clearInterval(this.heartbeat);
        this.ws.removeAllListeners();
        this.ws.close(code);
        this.ws = null;
        this.heartbeat = null;
        this.harusame.emit('close', this.name, `Close Code: ${code}. Reason: ${reason || 'None'}`);

        if (code !== 1000) 
            return setTimeout(this.start.bind(this), this.harusame.config.interval);
        
        this.attempts = 0;
        this.harusame.emit('disconnect', this.name, 'Socket Disconnected with close code 1000. Please reconnect manually');
    }

    static error(error) {
        this.harusame.emit('error', this.name, error);
        this.ws.close(1011, error.message);
    }

    static open() {
        clearInterval(this.heartbeat);
        this.heartbeat = null;
        this.harusame.emit('open', this.name);
    }

    static message(msg) {
        try {
            msg = JSON.parse(msg);
        } catch (error) {
            return HarusameSocketEvents.error.bind(this, error);
        }
        switch (msg.op) {
            case 0: {
                this.attempts = 0;
                this._setHeartbeat(msg.d.heartbeat);
                this.harusame.emit('debug', this.name, `Set to heartbeat every ${msg.d.heartbeat} ms`);
                this.harusame.emit('ready', this.name);
                break;
            }
            case 1: {
                if (msg.t !== 'TRACK_UPDATE' && msg.t !== 'TRACK_UPDATE_REQUEST' && msg.t !== 'QUEUE_UPDATE' && msg.t !== 'NOTIFICATION') break;
                if (msg.d) return;
                const { d } = msg;
                if (!d.song) return;
                this.data = {
                    songName: d.song.title ? d.song.title : 'None',
                    songArtist: d.song.artists.length ? d.song.artists.map(a => a.nameRomaji || a.name).join(', ') : 'None',
                    songRequest: d.requester ? d.requester.displayName : 'None',
                    songAlbum: d.song.albums && d.song.albums.length > 0 ? d.song.albums[0].name : 'None',
                    songCover: d.song.albums && d.song.albums.length > 0 && d.song.albums[0].image ? `https://cdn.listen.moe/covers/${d.song.albums[0].image}` : 'https://listen.moe/public/images/icons/apple-touch-icon.png',
                    listeners: d.listeners || 0
                };
                this.harusame.emit('songUpdate', this.name, this.data);
                break;
            }
            case 10:
                this.harusame.emit('debug', this.name, 'Heartbeat acknowledged.');

        }
    }
}

module.exports = HarusameSocketEvents;