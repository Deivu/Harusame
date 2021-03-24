import EventEmitter from 'events';

declare module 'harusame' {
  interface SongUpdateData {
    songName: string;
    songArtist: string;
    songRequest: string;
    songAlbum: string;
    songCover: string;
    listeners: number;
  }

  interface Song {
    JP: {
      songName: string;
      songArtist: string;
      songRequest: string;
      songAlbum: string;
      songCover: string;
      listeners: number;
    };
    KR: {
      songName: string;
      songArtist: string;
      songRequest: string;
      songAlbum: string;
      songCover: string;
      listeners: number;
    };
  }

  interface Config {
    attempts?: number;
    interval?: number;
  }

  export class Harusame extends EventEmitter {
    constructor(config?: Config);

    public connect(radio: string): void;
    public destroy(): void;

    get config(): Config;
    get song(): Song;

    on(event: 'debug', listener: (name: string, msg: string) => void): this;
    on(event: 'error', listener: (name: string, error: string) => void): this;
    on(event: 'close', listener: (name: string, reason: string) => void): this;
    on(event: 'open', listener: (name: string) => void): this;
    on(event: 'ready', listener: (name: string) => void): this;
    on(event: 'songUpdate', listener: (name: string, data: SongUpdateData) => void): this;
  }
}
