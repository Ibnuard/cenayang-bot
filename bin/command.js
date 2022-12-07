
const reply = (message, reply = '') => {
    return message.reply(reply)
}

const send = (client, message, reply, ops) => {
    return client.sendMessage(message.from, reply, ops);
}


//bot functional


//kirim ping
const ping = (client, message) => {
    const word = "Halo saya adalah Bot Gedang, Gedang berarti pisang, gak tau developer saya emang suka lawak. Ibnu tolong kalo buat bot jangan lawak namanya hihi, kalo mau kontaknya bisa pake perintah !owner"
    send(client, message, word)
}

//owener
const owner = (client, message) => {
    const word = "_Kontak Owner Bot_\n\nt.me/bluetterflys"
    send(client, message, word)
}

//menu
const menu = (client, message) => {
    const _generateWord = (arr = []) => {
        const prefix = '*List Perintah*\n\n'
        let temp = ''

        for (let i=0;i<arr.length;i++){
            temp = temp + `_${arr[i].cmd}_ --> ${arr[i].desc}\n`
        }

        return prefix +temp
    }

    const data = [
        {
            cmd: '!ping',
            desc: 'Untuk mengetahui status bot'
        },
        {
            cmd: '!owner',
            desc: 'Untuk mengetahui info owner'
        },
        {
            cmd: '!sticker',
            desc: 'Untuk membuat sticker dari gambar'
        },
    ]

    const word = _generateWord(data)
    send(client, message, word)
}

//owener
const sticker = async(client, message) => {
     if(message.hasMedia) {
        const media = await message.downloadMedia();
        reply(message, 'Sticker lagi otw dibikin yaa...')

        if (media){
            send(client, message, media, { sendMediaAsSticker: true })
        }
    }else{
        console.log('Ga ada medianya...');
        const word = "Tidak ada gambar untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker."
        reply(message, word)
    }
    
}

module.exports =  {
    reply: reply, 
    send: send, 
    ping: ping,
    owner: owner,
    sticker: sticker,
    menu: menu
}