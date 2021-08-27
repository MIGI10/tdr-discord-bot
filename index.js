const Discord = require('discord.js');
const client = new Discord.Client();
const db = require("mongoose");
const {token} = require('./token.json');
const config = require('./config.json');


client.prefix = config.prefix;
client.commands = new Discord.Collection();
client.discordjs = Discord;
client.config = config;
client.db = db;

const commands = require("./core/command");
commands.run(client);

const events = require("./core/event");
events.run(client);

//db.Promise = global.Promise;
db.connect(`mongodb://${config.dbHostname}:${config.dbPort}/${config.dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new db.Schema({
    userTag: String,
    userID: String,
    isMuted: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    moderations: {
        warns: Array,
        mutes: Array,
        kicks: Array,
        bans: Array
    }
});

const member = db.model("member", userSchema);

db.member = member;

const checkMutes = require("./timechecks/checkMutes");
checkMutes.run(client);

const checkBans = require("./timechecks/checkBans");
checkBans.run(client);


client.on('warn', (warn) => console.warn('[EVENT - WARN]' + warn));
client.on('error', (error) => console.error('[EVENT - ERROR]' + error));
client.on('invalidated', () => console.fatal('[EVENT]' + 'Session invalidated!'));
client.on('rateLimit', (info) => console.warn('[EVENT]' + ` Ratelimit hit, ${info.timeout}ms delay`));

client.login(token);