const { Harusame } = require('../index');

const Client = new Harusame();

Client.on('debug', (name, msg) => console.log(`Websocket Name: ${name}, Debug Message: ${msg}`));
Client.on('error', (name, error) => console.error(`Websocket Name: ${name}`, error));
Client.on('close', (name, reason) => console.log(`Websocket Name: ${name}, Close Data: ${reason}`));
Client.on('open', (name) => console.log(`Websocket Name: ${name} is now open.`));
Client.on('ready', (name) => console.log(`Websocket Name: ${name} is now ready`));
Client.on('songUpdate', (name, data) => console.log(`Websocket Name: ${name}, Song:`, data));
