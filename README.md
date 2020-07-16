## Harusame
<p align="center">
  <img src="https://vignette.wikia.nocookie.net/kancolle/images/3/3f/Harusame_Valentine_Full.png">
</p>

The ShipGirl Project. Harusame `(c) Kancolle for Harusame`

### Installation
Master
```
npm i Deivu/Harusame
```
Stable
```
npm i Harusame
```

### Examples
For invoked type code example, check [Client-Invoked.js](https://github.com/Deivu/Harusame/blob/master/tests/Client-Invoked.js)

For event driven code example, check [Client-Event.js](https://github.com/Deivu/Harusame/blob/master/tests/Client-Event.js)

### Documentation

> Harusame Client Options
```js
// Default Options
const { Harusame } = require('harusame');
new Harusame({ attempts: 3, interval: 5000 });
```
| Name             | Description
|------            |------
|`options.attempts`| Specifies how much Harusame will retry to connect to LISTEN.moe ws before you manually reconnect. Defaults to 3.
|`options.interval`| Specifies the interval between reconnects. Defaults to 5000 ms.

> Harusame Events
```js
const client = new Harusame()
  .on('debug', (name, msg) => console.log(`${name}, Debug Message: ${msg}`))
  .on('error', (name, error) => console.error(`${name}, error`, error))
  .on('close', (name, reason) => console.log(`${name}, Close Data: ${reason}`))
  .on('open', (name) => console.log(`${name} is now open.`))
  .on('ready', (name) => console.log(`${name} is now ready`))
  .on('songUpdate', (name, data) => console.log(`${name}, Song:`, data));
```
| Name       | Description
|------      |------
|`debug`     | Emitted when a debug message is fired.
|`error`     | Emitted when an error was thrown when handling something. **must be handled**
|`close`     | Emitted when a websocket connection closed.
|`open`      | Emitted when a websocket connection is opened.
|`ready`     | Emitted when a websocket connection is ready.
|`songUpdate`| Emitted when a new track is playing at LISTEN.moe.

> Harusame Properties & Methods
```js
const client = new Harusame()
  .on('error', (name, error) => console.error(`${name}, error:`, error));

console.log(client.config);
console.log(client.song);

// Connect or Destroy JPOP LISTEN.moe WS
client.connect('JP'); 
client.destroy('JP');

// Connect or Destroy KPOP LISTEN.moe WS
client.connect('KR'); 
client.destroy('KR');
```

- Properties

`client.config` => returns the config you have set to Harusame.

`client.song` => returns an object with two keys, which is **JP** and **KR**.

- Methods

`client.connect()` => connects the WS you want.

`client.destroy()` => destroys the WS you want.