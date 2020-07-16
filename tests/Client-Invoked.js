const { Harusame } = require('../index');

const Client = new Harusame();

Client.on('error', (name, error) => console.error(`${name} error,`, error));

setInterval(() => console.log(Client.song), 6000);