const { Client, Guild, GatewayIntentBits  } = require('discord.js');
const config = require("./config.json")


const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences
    ]
});

/** @type {Guild|undefined} */
var guild = undefined

client.on('ready', () => {
    console.log(`Alowlist bot is online`)
    guild = client.guilds.cache.get(config.guild)
    console.log("Guild assigned:", guild.name)
});

/** @returns {"allowlisted"|"notindiscord"|"norole"|"error"} */
function isPlayerAllowlisted(discord){
    try{
        if(!guild)throw "Guild is not assigned yet";
        const member = guild.members.cache.get(discord)
        if(!member)return "notindiscord"

        const role = member.roles.cache.get(config.allowlistRole)
        if(!role)return "norole"
        return "allowlisted";
    }catch(ex){
        console.error(ex)
        return "error"
    }
}

on('playerConnecting', (_, _1, deferrals) => {
    deferrals.defer()
    const player = global.source;

    setTimeout(() => {
        const num = GetNumPlayerIdentifiers(player)
        for(let i = 0; i < num; i++){
            const identifier = GetPlayerIdentifier(player, i)
            const split = identifier.split(':')
            if(split.length < 2 || split[0] !== 'discord')continue;

            const discord = split[1]
            const message = isPlayerAllowlisted(discord)
            if(message === "error"){
                deferrals.done(config.errorMessage)
                return;
            }
            if(message === "notindiscord"){
                deferrals.done(config.notInDiscordMessage)
                return;
            }
            if(message === "norole"){
                deferrals.done(config.noRoleMessage)
                return;
            }
        }
        deferrals.done();
    }, 0);
})

client.login(config.token);