module.exports = (client, message) => {

    if (message.author.bot) return;

    if (message.channel.type === 'dm') return;

    if (!message.guild.me.permissions.has(["SEND_MESSAGES"]) && !message.channel.permissionsFor(message.member).has('SEND_MESSAGES', false)) return;

    if (!message.content.toLowerCase().startsWith(client.prefix)) return;

    const args = message.content.split(/ +/g);
    
    const command = args.shift().slice(client.prefix.length).toLowerCase();
    
    const cmd = client.commands.get(command);

    if (!cmd) return;

    const isMod = message.member.roles.cache.has(client.config.modRole);

    if (cmd.requirements.modOnly && !isMod && !client.config.botOwnerID.includes(message.author.id))
        return message.reply('This command is restricted to moderators only.')
            .then(msg => setTimeout(() => { 
                msg.delete(); 
                message.delete() 
            }, 5000))

    if (cmd.requirements.ownerOnly && !cmd.requirements.modOnly && !client.config.botOwnerID.includes(message.author.id))
        return message.reply('Only the bot owner (migi28#0001) can use this command!')
            .then(msg => setTimeout(() => { 
                msg.delete(); 
                message.delete() 
            }, 5000))

    if (cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
        return message.reply(`Command failed. You must have a role with the following permissions: ${cmd.requirements.userPerms}`)
            .then(msg => setTimeout(() => { 
                msg.delete(); 
                message.delete() 
            }, 10000))

    if (cmd.requirements.clientPerms && !message.guild.me.permissions.has(cmd.requirements.clientPerms))
        return message.reply(`Command failed. I'm missing the following permissions: ${cmd.requirements.clientPerms}`)
            .then(msg => setTimeout(() => { 
                msg.delete(); 
                message.delete() 
            }, 10000))


    cmd.run(client, message, args);
}

    