module.exports.run = async (client, message, args) => {

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) return message.channel.send('Please provide a valid username/ID.');

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser.id,

    }).catch(err => console.log(err));

    if (!userLog) return message.channel.send('No logs found for this user.');

    const data = [];

    for (let i = 0; userLog.moderations.warns.length > i; i++) {
        data.push(`**Warning ${i + 1}**`)
        data.push(`**Date:** ${userLog.moderations.warns[i].date}`)
        data.push(`**Reason:** ${userLog.moderations.warns[i].reason}`)
        data.push(`**Moderator:** ${userLog.moderations.warns[i].moderator}\n`)
    }

    for (let i = 0; userLog.moderations.mutes.length > i; i++) {

        if (!userLog.moderations.mutes[i].unmute) {
            data.push(`**Mute ${i + 1}**`)
            data.push(`**Date:** ${userLog.moderations.mutes[i].date}`)
            data.push(`**Reason:** ${userLog.moderations.mutes[i].reason}`)
            data.push(`**Moderator:** ${userLog.moderations.mutes[i].moderator}`)
            data.push(`**Duration:** ${userLog.moderations.mutes[i].duration}\n`)

        } else {
            data.push(`**Unmute**`)
            data.push(`**Date:** ${userLog.moderations.mutes[i].date}`)
            data.push(`**Reason:** ${userLog.moderations.mutes[i].reason}`)
            data.push(`**Moderator:** ${userLog.moderations.mutes[i].moderator}\n`)
        }
    }

    for (let i = 0; userLog.moderations.kicks.length > i; i++) {
        data.push(`**Kick ${i + 1}**`)
        data.push(`**Date:** ${userLog.moderations.kicks[i].date}`)
        data.push(`**Reason:** ${userLog.moderations.kicks[i].reason}`)
        data.push(`**Moderator:** ${userLog.moderations.kicks[i].moderator}\n`)
    }

    for (let i = 0; userLog.moderations.bans.length > i; i++) {

        if (!userLog.moderations.bans[i].unban) {
            data.push(`**Ban ${i + 1}**`)
            data.push(`**Date:** ${userLog.moderations.bans[i].date}`)
            data.push(`**Reason:** ${userLog.moderations.bans[i].reason}`)
            data.push(`**Moderator:** ${userLog.moderations.bans[i].moderator}`)
            data.push(`**Duration:** ${userLog.moderations.bans[i].duration}\n`)
        } else {
            data.push(`**Unban**`)
            data.push(`**Date:** ${userLog.moderations.bans[i].date}`)
            data.push(`**Reason:** ${userLog.moderations.bans[i].reason}`)
            data.push(`**Moderator:** ${userLog.moderations.bans[i].moderator}\n`)
        }
    }

    const modlogsEmbed = new client.discordjs.MessageEmbed()
        .setColor('#119afd')
        .setTitle(`${mentionedUser.user.tag} | ${mentionedUser.id} | Logs: ${data.join('').split('\n').length - 1}`)
        .setDescription(data.join('\n'));

    message.channel.send(modlogsEmbed);

}

module.exports.help = {
    name: "modlogs",
    description: "View all moderation logs from a member."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: true
}