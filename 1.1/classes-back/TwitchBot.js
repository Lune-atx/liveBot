require("dotenv").config();

class TwitchBot{

    constructor(){  
        this.id = process.env.ID;       
        //  Gestion des timers des commandes
        this.timer = {
            // timming en secondes
            setTime:(name, timming)=>{               
                this.timer[name]=Date.now()+timming*1000;
            },
            getTime:(name)=>{
                let time = {
                    week: Math.floor((this.timer[name] - Date.now())/(1000*360*24*7)),
                    day: Math.floor((this.timer[name] - Date.now())/(1000*360*24)),
                    hour: Math.floor((this.timer[name] - Date.now())/(1000*360)),
                    min: Math.floor((this.timer[name] - Date.now())/(1000*60)),
                    // A détailler
                    sec: Math.floor(((this.timer[name] - Date.now())/1000)-Math.floor((this.timer[name] - Date.now())/60000)*60)
                };
               return time;
            },
            timeOut:(name)=>{
                if(Date.now()>=this.timer[name]){
                    return true;
                }else{      
                    return false;
                }
            } 
        }
        // Tmi pour la connexion à Twitch
        this.tmi = require('tmi.js');
        this.setClient();    
        this.client.connect();
        this.start();
    }
    setClient(){
        this.client = new this.tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: process.env.USER_NAME,
                password: process.env.PWD
            },
            channels: [process.env.CHANNELS]
        });
    }
    start(){
        this.client.on("roomstate", (channel, state) => {
            this.channel=channel;
            this.sendChat("Bonjour tout le monde ! :D");
            console.log("\n===( TwitchBot )=( Launched )\n");  
        });
        this.client.on('message', (channel, tags, message, self)=>{  
            if(self) return;
            console.log(`${tags.username} : ${message}`); 
        });
    }
    sendChat(msg){
        this.client.say(this.channel , msg);
    }   
    dice(face){
        return Math.floor(Math.random()*face)+1;
    }
}

module.exports = {
    class: TwitchBot 
}