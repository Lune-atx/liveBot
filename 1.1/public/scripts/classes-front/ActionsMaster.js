import {actions} from "../config/actions.js";
import {sounds} from "../config/sounds.js";
import {TimerMaster} from "./TimerMaster.js";

let timerMaster = new TimerMaster();

export class ActionsMaster{      
    constructor(){
        this.actionsTimers = [];
        this.actionsLaunched = [];     
        // les images sont nommée numériquement en partant de 0
        this.actionImg = 0;      
        this.actionCount = 0;
        this.appsArea = document.getElementById("appsArea");
        // création div ActionsArea
        this.actionsArea = document.createElement("div");
        this.actionsArea.classList.add("actionsArea"); 
        // initialisation sockets
        this.socket = io();        
        this.listen();
    }   
    
    listen(){
        this.socket.on("ActionsMaster", (datas)=>{
            // lancement des actions
            this.launch();
            setTimeout(()=>{
                // données envoyées au chat pour affichage
                datas = {
                    username : datas.username,
                    actions : this.actionsLaunched
                }
                this.socket.emit("ActionsMaster-actions", datas);
            }, 1000);
        });
        this.socket.on("ActionsMaster-end", (datas)=>{
            sounds.actionsMaster.endingBeforeEnd();
            // reset + chat à la fin du son
            setTimeout(()=>{
                sounds.actionsMaster.ending();
                this.reset();
                this.socket.emit("ActionsMaster-end-done", {});
            }, 6*1000);
        });
    }
    
    launch(){ 
        // réinitialisation des actions        
        this.reset();
        // tirage des actions
        actions.forEach(action=>{ 
            if(Math.random()>0.6){ 
                this.handleCreateElement(action);
                this.actionsLaunched.push(action);
                this.actionImg ++;
                this.actionCount ++;
            } 
        });
        // si il y a des actions
        if(this.actionCount){
            sounds.actionsMaster.lauching();      
        }else{
            sounds.actionsMaster.fail(); 
        }
        return this.actionsLaunched;
    }

    reset(){
        this.actionsLaunched = [];       
        this.actionsArea.innerHTML = "";
        this.actionImg = 0;      
        this.actionCount = 0;
        // suppression de tout les timers du dom + vide le tableau
        let timerCount = 0;
        this.actionsTimers.forEach(timer=>{
            clearInterval(timer);
            // quand tous les timer son clear
            if(this.actionsTimers.length-1== timerCount){
                this.actionsTimers = [];
            } 
        });
        // suppression de tout les timer dans timerMaster
        this.actionsLaunched.forEach(action =>{
            delete timerMaster[action.name];
        });
    }

    handleCreateElement(action){        
        // div action
        let actionNode = document.createElement("div");
        actionNode.classList.add("action");        
        // image action
        let actionImg = document.createElement("div");
        actionImg.classList.add("action_pic");
        actionImg.style.backgroundImage= `url("/medias/img/ActionsMaster/${this.actionImg}.jpg")`;
        actionNode.append(actionImg);        
        // nom action
        let actionName = document.createElement("p");
        actionName.classList.add("action_text");
        actionName.innerText= action.name;
        actionNode.append(actionName);          
        // si timer
        if(action.timeout){ 
            // creation noeud timer         
            let actionTimeout = document.createElement("p");
            actionTimeout.classList.add("action_timeout");
            // initialisation timer
            timerMaster.setTime(action.name, action.timeout);
            let time = timerMaster.getTime(action.name);
            actionTimeout.innerText = `${time.min} min ${time.sec} sec`;
            // ajout du timer à l'action
            actionNode.append(actionTimeout);
            // lancement du timer
            this.runTimeout(action, actionNode);
        }
        // ajout des actions à ActionsArea
        this.actionsArea.append(actionNode);
        // ajout de ActionsArea au Dom
        this.appsArea.append(this.actionsArea);
    }

    runTimeout(action, actionNode){
        let time;
        let actionTimer = setInterval(() => {  
            // si le temps est écoulé on clear l'interval, sinon on remet à jour le temps
            if(timerMaster.timeout(action.name)){
                sounds.actionsMaster.ending();
                // clean l'action dom
                actionNode.remove(actionNode);   
                // fin d'action  dans le chat             
                this.socket.emit("ActionsMaster-end-actions", {action : action});
                clearInterval(actionTimer); 
            }else{
                time = timerMaster.getTime(action.name);
                actionNode.querySelector(".action_timeout").innerText = `${time.min} min ${time.sec} sec`;
            }
        }, 1000);
        // ajout du timer au gestionnaire de timer
        this.actionsTimers.push(actionTimer);
    }
}