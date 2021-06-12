require("dotenv").config();
const configImport = require("../config");
const { server } = require("../server");
const importTwitchBot = require("../app");
const twitchBot = importTwitchBot.bot;

let config = configImport.config;

class GoalMaster{
    // cooldown en minutes
    prefix = '║ ';
    separator = '░';
    cooldown = config.goal.cooldown;
    constructor(){        
        this.listenSockets();
        this.listenCommands(); 
    }
    /**
     * Ecouteurs
     */
    listenSockets(){
        server.io.on("connection", (socket)=>{   
            // Affichage des goals dans le chat
            socket.on("GoalMaster-goal", (datas)=>{
                let answerBody = '';                
                answerBody = answerBody+`${this.separator} ${datas.goal.name} `;
                twitchBot.sendChat(`${this.prefix}${answerBody}`);
                
            });
            // fin du goal
            socket.on("GoalMaster-end-goals", (datas)=>{
                twitchBot.sendChat(`${this.prefix} ${this.separator} ${datas.goal.name} est terminée !`);
            });
            // fin GoalsMaster
            socket.on("GoalMaster-end-done", ()=>{
                twitchBot.sendChat(`${this.prefix} L'objectif est terminé !`);
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
            if(message.match(/^!objectif/)){
                // s'il y a déjà un timer sur la actions              
                if(twitchBot.timer["GoalMaster"]){
                    // s'il est fini
                    if(twitchBot.timer.timeOut("GoalMaster")){
                        twitchBot.timer.setTime("GoalMaster", this.cooldown);
                        this.doSwitchGoal(message, tags);
                    // S'il n'est pas fini
                    }else{
                        let time = twitchBot.timer.getTime("GoalMaster");
                        twitchBot.sendChat(`@${tags.username}, cette commande sera disponible dans ${time.min} minute(s) et ${time.sec} seconde(s).`);
                    }
                // s'il n'y a pas de timer
                }else{
                    twitchBot.timer.setTime("GoalMaster", this.cooldown);
                    this.doSwitchGoal(message, tags);
                }  
            }
        });
    }
    // gestion des commandes
    doSwitchGoal(message, tags){
        let command = message.replace(/^!objectif/, '' ).trim();
        switch (command){
            // lancement des actions
            case '':
                server.send("GoalMaster", {username : tags.username});
                twitchBot.GoalMaster = true;
                break;
            // fin des actions
            case 'fin':
                if(twitchBot.GoalMaster){
                    twitchBot.GoalMaster = false;
                    server.send("GoalMaster-end", {});
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
    class : GoalMaster
}