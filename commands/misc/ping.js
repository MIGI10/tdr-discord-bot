module.exports.run = (client, message, args) => {

    const pingEmbed = new client.discordjs.MessageEmbed()
        .setColor(65453)
        .setTitle('Pong :ping_pong:')
        .addField('WS Latency', `> ${Math.abs((Date.now() - message.createdTimestamp))}ms`)
        .addField('API Latency', `> ${Math.round(client.ws.ping)}ms`)

    message.channel.send(pingEmbed);
}

module.exports.help = {
    name: "ping",
    description: "ping command"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}