import EventEmitter from "events";

declare module "harusame" {
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
    /**
     * Options for connecting Harasume to Listen.moe
     * @param config Client connection options
     */
    constructor(config?: Config);

    /**
     * Connect JPOP / KPOP LISTEN.moe WS
     * @param radio JP or KR - Case sensitive
     */
    public connect(radio: string): void;

    /**
     * Destroy JPOP / KPOP LISTEN.moe WS
     * @param radio JP or KR - Case sensitive
     */
    public destroy(radio: string): void;

    /**
     * Get current client configuration
     */
    get config(): Config;

    /**
     * Get current KR and JP type songs from Listen.moe
     */
    get song(): Song;

    /**
     * Emitted when a debug message is fired.
     * @param event Debug
     * @param listener Name Socket and msg data
     */
    on(event: "debug", listener: (name: string, msg: string) => void): this;

    /**
     * Emitted when an error was thrown when handling something. must be handled
     * @param event Error
     * @param listener Name Socket and reason data
     */
    on(event: "error", listener: (name: string, error: string) => void): this;

    /**
     * Emitted when a websocket connection closed.
     * @param event Close
     * @param listener Name Socket and reason data
     */
    on(event: "close", listener: (name: string, reason: string) => void): this;

    /**
     * Emitted when a websocket connection is opened.
     * @param event Open
     * @param listener Name Socket data
     */
    on(event: "open", listener: (name: string) => void): this;

    /**
     * Emitted when a websocket connection is ready.
     * @param event Ready
     * @param listener Name Socket data
     */
    on(event: "ready", listener: (name: string) => void): this;

    /**
     * Emitted when a new track is playing at LISTEN.moe.
     * @param event SongUpdate
     * @param listener Song data
     */
    on( event: "songUpdate", listener: (name: string, data: SongUpdateData) => void): this;
  }
}
