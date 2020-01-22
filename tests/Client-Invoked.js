const { Harusame } = require('../index');

const Client = new Harusame();

Client.on('error', (name, error) => console.error(`Websocket Name: ${name}`, error));

setInterval(() => console.log(Client.song), 6000);