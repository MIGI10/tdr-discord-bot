module.exports.run = (client, message, args) => {

    if (args[0] && client.commands.has(args[0])) {

        const cmd = client.commands.get(args[0])

        console.log(client.commands)

        const commandEmbed = new client.discordjs.MessageEmbed()
            .setTitle(`Help | Command`)
            .setDescription(`**Name:** ${cmd.help.name}\n **Description:** ${cmd.help.description}`)
        
        message.channel.send(commandEmbed)

    } else {

        const helpEmbed = new client.discordjs.MessageEmbed()
            .setTitle(`Help | Command List`)
            .setDescription(client.commands.map(cmd => cmd.help.name).join(', '))
        
        message.channel.send(helpEmbed)
    }
}

module.exports.help = {
    name: "help",
    description: "help command"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false, 
    modOnly: false
}