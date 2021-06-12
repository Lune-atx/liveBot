require("dotenv").config();
const configImport = require("../config");
let config = configImport.config;
const { server } = require("../server");
const importTwitchBot = require("../app");
const twitchBot = importTwitchBot.bot;


class ActionsMaster{
    // cooldown en minutes
    prefix = '╣ ';
    separator = '░';
    cooldown = config.actions.cooldown;
    constructor(){        
        this.listenSockets();
        this.listenCommands(); 
    }
    /**
     * Ecouteurs
     */
    listenSockets(){
        server.io.on("connection", (socket)=>{   
            // Affichage des actions dans le chat
            socket.on("ActionsMaster-actions", (datas)=>{
                let answerBody = '';
                datas.actions.forEach(action => {
                    answerBody = answerBody+`${this.separator} ${action.name} `;
                });
                if(answerBody.length>0){
                    twitchBot.sendChat(`${this.prefix}${answerBody}`);
                }else{
                    twitchBot.sendChat(`Désolé @${datas.username}, @${config.stream.streamerName} a une chance insolente !`);
                }
            });
            // fin d'action
            socket.on("ActionsMaster-end-actions", (datas)=>{
                twitchBot.sendChat(`${this.prefix} ${this.separator} ${datas.action.name} est terminée !`);
            });
            // fin ActionsMaster
            socket.on("ActionsMaster-end-done", ()=>{
                twitchBot.sendChat(`${this.prefix} Les trolls sont terminés !`);
            });
        });
    }
    /**
    * Commandes 
    **/ 
     listenCommands(){
        twitchBot.client.on('message', (channel, tags, message, self)=>{      
            if (self) return;        
            // !actions
            if(message.match(/^!troll/)){
                // s'il y a déjà un timer sur la actions              
                if(twitchBot.timer["ActionsMaster"]){
                    // s'il est fini
                    if(twitchBot.timer.timeOut("ActionsMaster")){
                        twitchBot.timer.setTime("ActionsMaster", this.cooldown);
                        this.doSwitchAction(message, tags);
                    // S'il n'est pas fini
                    }else{
                        let time = twitchBot.timer.getTime("ActionsMaster");
                        twitchBot.sendChat(`@${tags.username}, cette commande sera disponible dans ${time.min} minute(s) et ${time.sec} seconde(s).`);
                    }
                // s'il n'y a pas de timer
                }else{
                    twitchBot.timer.setTime("ActionsMaster", this.cooldown);
                    this.doSwitchAction(message, tags);
                }  
            }
        });
    }
    // gestion des commandes
    doSwitchAction(message, tags){
        let command = message.replace(/^!troll/, '' ).trim();
        switch (command){
            // lancement des actions
            case '':
                server.send("ActionsMaster", {username : tags.username});
                twitchBot.ActionsMaster = true;
                break;
            // fin des actions
            case 'fin':
                if(twitchBot.ActionsMaster){
                    twitchBot.ActionsMaster = false;
                    server.send("ActionsMaster-end", {});
                }else{
                    twitchBot.sendChat(`@${tags.username}, aucune action n'est en cours.`);
                }
                break;
            default:
                twitchBot.sendChat(`@${tags.username}, cette commande est invalide.`);
        }
    }
};

module.exports = {
    class : ActionsMaster
}