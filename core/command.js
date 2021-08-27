const { readdirSync } = require('fs');
const { join } = require('path');
const funFilePath = join(__dirname, "..", "commands", "fun");
const miscFilePath = join(__dirname, "..", "commands", "misc");
const modFilePath = join(__dirname, "..", "commands", "mod");

module.exports.run = (client) => {
    
    for (const cmd of readdirSync(funFilePath).filter(cmd => cmd.endsWith(".js"))) {
        const prop = require(`${funFilePath}/${cmd}`);
        client.commands.set(prop.help.name, prop);
    }

    for (const cmd of readdirSync(miscFilePath).filter(cmd => cmd.endsWith(".js"))) {
        const prop = require(`${miscFilePath}/${cmd}`);
        client.commands.set(prop.help.name, prop);
    }

    for (const cmd of readdirSync(modFilePath).filter(cmd => cmd.endsWith(".js"))) {
        const prop = require(`${modFilePath}/${cmd}`);
        client.commands.set(prop.help.name, prop);
    }

    console.log(`Loaded ${client.commands.size} commands!`);
}