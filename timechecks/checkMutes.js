module.exports.run = (client) => {

    async function checkExpiredMutes() {

        const member = client.db.member

        const query = member.find({ isMuted: true })

        for await (const member of query) {

            const mutesArray = member.moderations.mutes
            const lastMute = mutesArray[mutesArray.length - 1]

            if ((Date.now() - lastMute.timeAtEnd) > 0) {

                const guild = client.guilds.cache.get(client.config.guildID);
                const mutedUser = guild.members.cache.get(member.userID);
                mutedUser.roles.remove(client.config.muteRole, 'Mute time completed')
                    .then(user => {

                        const timeMuted = (lastMute.timeAtEnd - lastMute.timeAtGive) > 3600000 ?
                            Math.round((lastMute.timeAtEnd - lastMute.timeAtGive)*2.77*Math.pow(10, -7)) + ' hours':
                            Math.round((lastMute.timeAtEnd - lastMute.timeAtGive)*1.66*Math.pow(10, -5)) + ' minutes'

                        const logEmbed = new client.discordjs.MessageEmbed()
                            .setColor('#119afd')
                            .setTitle(`${member.userTag} | ${member.userID}`)
                            .setDescription(`User has been unmuted after ${timeMuted}`);

                        guild.channels.cache.get(client.config.logChannel).send(logEmbed)
                    }) 
                    .catch(console.error);

                query.updateOne({ $set: { isMuted: false }}, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

            } else {
                // Do nothing
            }
        }
    }

    setTimeout(checkExpiredMutes, 5000);
    setInterval(checkExpiredMutes, 60*1000);
}