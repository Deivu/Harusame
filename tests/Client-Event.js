const { Harusame } = require('../index');

const Client = new Harusame();

// Optional
Client.on('debug', (name, msg) => console.log(`${name}, Debug Message: ${msg}`));
Client.on('close', (name, reason) => console.log(`${name}, Close Data: ${reason}`));
Client.on('open', (name) => console.log(`${name} is now open.`));
Client.on('ready', (name) => console.log(`${name} is now ready`));
Client.on('songUpdate', (name, data) => console.log(`${name}, Song:`, data));

// Needed
Client.on('error', (name, error) => console.error(`${name}, Error:`, error));