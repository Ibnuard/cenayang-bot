const { ping, owner, menu, sticker } = require("./command");

const onMessageReceived = async(client, message) => {
    // ex, format !sticker
    const getMessage = message.body
    const command = getMessage.split('!')[1]

    switch (command) {
        case 'ping':
            return ping(client, message)
            break;
        case 'owner':
            return owner(client, message)
            break;
        case 'sticker':
            return sticker(client, message)
            break;
        case 'menu':
            return menu(client, message)
            break;
        default:
            return null
            break;
    }
}

module.exports = {
    onMessageReceived: onMessageReceived
}