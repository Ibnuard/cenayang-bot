const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client({
    puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	}
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true}, );
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});
 

client.initialize();