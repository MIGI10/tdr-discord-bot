module.exports.run = async (client, message, args) => {

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) return message.channel.send('Please provide a valid member to ban.');

    if (mentionedUser.roles.cache.has(client.config.modRole)) return message.channel.send(`Staff members cannot be banned.`);

    const userIsBanned = await client.db.member.findOne({ 
        userID: mentionedUser.id,
        isBanned: true
    }).catch(err => console.log(err));

    if (userIsBanned) return message.channel.send('The user provided is already banned.');

    if (!args[1]) return message.channel.send('Please provide a valid ban duration ("lifetime" or number followed by m/h/d/w)');

    if (!args[1].match(/\d+(m|h|d|w)/g)) {
        if (!args[1] === 'lifetime') {
            return message.channel.send('Please provide a valid ban duration ("lifetime" or number followed by m/h/d/w)');
        }
    }

    const duration = args[1];

    const reason = args[2] ?
        args.slice(2).join(' '):
        'No reason provided.';

    mentionedUser.send(`You have been banned in ${message.guild.name} for ${duration} with the following reason: *${reason}*`)
        .catch(error => {
            console.log(error);
            if (error.code === 50007) {
                confirmmsg.edit(`User ${mentionedUser.user.tag} has been successfully banned for ${duration} with reason: *${reason}* but DM message failed to send.`)
            }
        });
    
    await mentionedUser.ban({ days: 7, reason: `Ban duration: ${duration} | Reason: ${reason} | By: ${message.author.tag}`});

    const confirmmsg = await message.channel.send(`User ${mentionedUser.user.tag} has been successfully banned for ${duration} with reason: *${reason}*`);

    const dateMS = Date.now();
    const date = new Date(dateMS).toISOString();
    
    if (duration.match(/\d+m/g)) { 
        const minutes = parseInt(duration.split('m')[0])
        const durationMS = minutes * 60000;
        var dateEndMS = dateMS + durationMS;
        var dateEnd = new Date(dateEndMS).toISOString();

    } else if (duration.match(/\d+h/g)) {
        const hours = parseInt(duration.split('h')[0])
        const durationMS = hours * 60000 * 60;
        var dateEndMS = dateMS + durationMS;
        var dateEnd = new Date(dateEndMS).toISOString();

    } else if (duration.match(/\d+d/g)) {
        const days = parseInt(duration.split('d')[0])
        const durationMS = days * 60000 * 60 * 24;
        var dateEndMS = dateMS + durationMS;
        var dateEnd = new Date(dateEndMS).toISOString();

    } else if (duration.match(/\d+w/g)) {
        const weeks = parseInt(duration.split('w')[0])
        const durationMS = weeks * 60000 * 60 * 24 * 7;
        var dateEndMS = dateMS + durationMS;
        var dateEnd = new Date(dateEndMS).toISOString();

    } else if (duration === 'lifetime') {
        var dateEndMS = null;
        var dateEnd = null;
    }

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser.id
    }).catch(err => console.log(err));

    if (userLog) {
        userLog.updateOne({ $set: { isBanned: true }}, (error) => {
            if (error) {
                console.log(error);
            }
        });
        userLog.moderations.bans.push({
            date: date,
            dateEnd: dateEnd,
            moderator: message.author.tag,
            reason: reason,
            duration: duration,
            timeAtGive: dateMS, 
            timeAtEnd: dateEndMS
        });

        await userLog.save().catch(err => console.log(err));

    } else {

        const createUserLog = new client.db.member({
            userTag: mentionedUser.user.tag,
            userID: mentionedUser.id,
            isBanned: true,
            moderations: {
                bans: [{
                    date: date,
                    dateEnd: dateEnd,
                    moderator: message.author.tag,
                    reason: reason,
                    duration: duration,
                    timeAtGive: dateMS,
                    timeAtEnd: dateEndMS
                }]
            }
        });

        await createUserLog.save().catch(err => console.log(err));
    }

    const logEmbed = new client.discordjs.MessageEmbed()
        .setColor('#119afd')
        .setTitle(`${mentionedUser.user.tag} | ${mentionedUser.id}`)
        .setDescription(`User has been banned for ${duration} by ${message.author.tag} with reason: *${reason}*`)
        .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);
}

module.exports.help = {
    name: "ban",
    description: "Ban a guild member with optional duration."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['MANAGE_ROLES'],
    ownerOnly: false,
    modOnly: true
}