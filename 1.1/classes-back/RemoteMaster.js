const importRemote = require("../app");
const remote = importRemote.remote;
const importTwitchBot = require("../app");
const twitchBot = importTwitchBot.bot;
const configImport = require("../config");
let config = configImport.config;

class RemoteMaster{
    cooldown = config.remote.cooldown;
    constructor(){      
        this.listenSockets();
        this.listenCommands(); 
    }
    /**
     * Ecouteurs
     */
    listenSockets(){
         // ERROR
         remote.obs.on('error', err => {
            console.error('socket error:', err);
        });

        // On Switch scene
        remote.obs.on('SwitchScenes', data => {
            console.log(`New Active Scene: ${data.sceneName}`);
            remote.current = data.sceneName;
        });
    }
    /**
    * Commandes 
    **/ 
    listenCommands(){
        twitchBot.client.on('message', (channel, tags, message, self)=>{      
            if (self) return;        
            // !remote
            if(message.match(/^!live/)){
                // s'il y a déjà un timer sur la remote              
                if(twitchBot.timer["RemoteMaster"]){
                    // s'il est fini
                    if(twitchBot.timer.timeOut("RemoteMaster")){
                        twitchBot.timer.setTime("RemoteMaster", this.cooldown);
                        let error = this.doSwitchScene(message, tags);
                        if(error === false){
                            twitchBot.sendChat(`@${tags.username}, cette catégorie n'est pas proposée par ${config.stream.streamerName}.`);
                        }
                    // S'il n'est pas fini
                    }else{
                        let time = twitchBot.timer.getTime("RemoteMaster");
                        twitchBot.sendChat(`@${tags.username}, cette commande sera disponible dans ${time.min} minute(s) et ${time.sec} seconde(s).`);
                    }
                // s'il n'y a pas de timer
                }else{
                    twitchBot.timer.setTime("RemoteMaster", this.cooldown);
                    this.doSwitchScene(message, tags);
                }  
            }
        });
    }
    // gestion des commandes
    doSwitchScene(message, tags){
        let command = message.replace(/^!live/, '' ).trim();
        switch (command){
            // changement de scènes
            case 'just chatting':
                if(config.remote.sceneName["just chatting"] != ""){
                    remote.switchScene(config.remote.sceneName["just chatting"]);
                }
                break;
            case 'music':
                if(config.remote.sceneName["music"] != ""){
                    remote.switchScene(config.remote.sceneName["music"]);
                }else{
                    return false;
                }
                break;
            case 'art':
                if(config.remote.sceneName["art"] != ""){
                    remote.switchScene(config.remote.sceneName["art"]);
                }else{
                    return false;
                }
                break;
            case 'gaming':
                if(config.remote.sceneName["gaming"] != ""){
                    remote.switchScene(config.remote.sceneName["gaming"]);
                }else{
                    return false;
                }
                break;
            case 'pool':
                if(config.remote.sceneName["pool"] != ""){
                    remote.switchScene(config.remote.sceneName["pool"]);
                }else{
                    return false;
                }
                break;
            case 'coding':
                if(config.remote.sceneName["coding"] != ""){
                    remote.switchScene(config.remote.sceneName["coding"]);
                }else{
                    return false;
                }
                break;
            default:
                twitchBot.sendChat(`@${tags.username}, cette catégorie n'est pas proposée par ${config.stream.streamerName}.`);
        }
    }
};

module.exports = {
    class : RemoteMaster
}