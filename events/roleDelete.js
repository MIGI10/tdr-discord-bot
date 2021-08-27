const {writeFile} = require('fs');
const config = require('../config.json');

module.exports = (client, role) => {

    if (role.id === config.discord.muteRole) {

        console.log('Mute role has been deleted');

        config.muteRole = ""
        
        writeFile('./config.json', JSON.stringify(config, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }   
}   