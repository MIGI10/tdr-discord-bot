const {writeFile} = require('fs');
const config = require('./config.json');

module.exports.run = async (client, message) => {

    message.channel.send('No mute role specified in config file, creating a mute role and adjusting permissions...')

    if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) 
        return message.channel.send('Mute role creation cancelled, in order to adjust all required permissions I need the "Administrator" permission.'); 

    await message.guild.roles.create({
        data: {
          name: 'Muted',
          color: "#000000",
          permissions: []
        },
        reason: 'Muted role created for mute command',
    })
    .catch(err => console.log(err));

    config.muteRole = message.guild.roles.cache.find(role => role.name === 'Muted').id;

    writeFile('./config.json', JSON.stringify(config, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
    });

    await message.guild.channels.cache.forEach((channel, id, i) => {
        setTimeout(() => {
            channel.createOverwrite(client.config.muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                SPEAK: false
            })
        }, (i+1) * 2000);
     });
    
    message.channel.send('Role was created and permissions were updated successfully!');
}