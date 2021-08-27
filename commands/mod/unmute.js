module.exports.run = async (client, message, args) => {

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) return message.channel.send('Please provide a user to unmute.');

    if (!mentionedUser.roles.cache.has(client.config.muteRole)) return message.channel.send('User provided is not currently muted.');

    const reason = args[1] ?
        args.slice(1).join(' '):
        'No reason provided.';

    mentionedUser.roles.remove(client.config.muteRole, `User unmuted | Reason: ${reason} | By: ${message.author.tag}`);

    const confirmmsg = await message.channel.send(`User ${mentionedUser.user.tag} has been successfully unmuted with reason: *${reason}*`);

    mentionedUser.send(`You have been unmuted in ${message.guild.name} with the following reason: *${reason}*`)
        .catch(error => {
            console.log(error);
            if (error.code === 50007) {
                confirmmsg.edit(`User ${mentionedUser.user.tag} has been successfully unmuted with reason: *${reason}* but DM message failed to send.`)
            }
        });

    const dateMS = Date.now();
    const date = new Date(dateMS).toISOString();

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser.id
    }).catch(err => console.log(err));

    if (userLog) {
        userLog.updateOne({ $set: { isMuted: false }}, (error) => {
            if (error) {
                console.log(error);
            }
        });
        userLog.moderations.mutes.push({
            unmute: true,
            date: date,
            moderator: message.author.tag,
            reason: reason,
            timeAtGive: dateMS
        });

        await userLog.save().catch(err => console.log(err));

    } else {

        const createUserLog = new client.db.member({
            userTag: mentionedUser.user.tag,
            userID: mentionedUser.id,
            moderations: {
                mutes: [{
                    unmute: true,
                    date: date,
                    moderator: message.author.tag,
                    reason: reason,
                    timeAtGive: dateMS
                }]
            }
        });

        await createUserLog.save().catch(err => console.log(err));
    }

    const logEmbed = new client.discordjs.MessageEmbed()
        .setColor('#119afd')
        .setTitle(`${mentionedUser.user.tag} | ${mentionedUser.id}`)
        .setDescription(`User has been unmuted by ${message.author.tag} with reason: ${reason}`)
        .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);
}

module.exports.help = {
    name: "unmute",
    description: "Unmute a member, revert mute command."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['MANAGE_ROLES'],
    ownerOnly: false,
    modOnly: true
}