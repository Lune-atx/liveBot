import {goals} from "../config/goals.js";
import {sounds} from "../config/sounds.js";
import {TimerMaster} from "./TimerMaster.js";

let timerMaster = new TimerMaster();

export class GoalMaster{      
    constructor(){
        this.goalTimers = [];
        // Pour éviter un undefinded
        this.goal = {
            name : '',
            timout: ''
        }
        this.appsArea = document.getElementById("appsArea");
        // création div goalArea
        this.goalArea = document.createElement("div");
        this.goalArea.classList.add("goalArea"); 
        // initialisation sockets
        this.socket = io();        
        this.listen();
    }   
    
    listen(){
        this.socket.on("GoalMaster", (datas)=>{
            // lancement des goals
            this.launch();
            setTimeout(()=>{
                // données envoyées au chat pour affichage
                datas = {
                    username : datas.username,
                    goal : this.goal
                }
                this.socket.emit("GoalMaster-goal", datas);
            }, 1000);
        });
        this.socket.on("GoalMaster-end", (datas)=>{
            sounds.goalMaster.endingBeforeEnd();
            // reset + chat à la fin du son
            setTimeout(()=>{
                sounds.goalMaster.ending();
                this.reset();
                this.socket.emit("GoalMaster-end-done", {});
            }, 6*1000);
        });
    }
    
    launch(){ 
        // réinitialisation des goals        
        this.reset();
        // tirage des goals 
        let goalIndex = timerMaster.dice(goals.length);
        this.goal = goals[goalIndex-1];
        this.handleCreateElement(this.goal);    
        sounds.goalMaster.lauching();            
    }

    reset(){
        this.goalArea.innerHTML = "";
        // suppression du timer du dom + vide le tableau   
        clearInterval(this.goalTimer);
        this.goalTimers = [];      
        // suppression de tout les timer dans timerMaster        
        delete timerMaster[this.goal.name];
       
    }

    handleCreateElement(goal){        
        // div goals
        let goalNode = document.createElement("div");
        goalNode.classList.add("goal");        
        // image goals
        let goalImg = document.createElement("div");
        goalImg.classList.add("goal_pic");
        goalImg.style.backgroundImage= `url("/medias/img/goalMaster/goal.jpg")`;
        goalNode.append(goalImg);        
        // nom goal
        let goalName = document.createElement("p");
        goalName.classList.add("goal_text");
        goalName.innerText= goal.name;
        goalNode.append(goalName);          
        // si timer
        if(goal.timeout){ 
            // creation noeud timer         
            let goalTimeout = document.createElement("p");
            goalTimeout.classList.add("goal_timeout");
            // initialisation timer
            timerMaster.setTime(goal.name, goal.timeout);
            let time = timerMaster.getTime(goal.name);
            goalTimeout.innerText = `${time.min} min ${time.sec} sec`;
            // ajout du timer au goal
            goalNode.append(goalTimeout);
            // lancement du timer
            this.runTimeout(goal, goalTimeout);
        }
        // ajout des goals à goalsArea
        this.goalArea.append(goalNode);
        // ajout de goalsArea au Dom
        this.appsArea.prepend(this.goalArea);

    }

    runTimeout(goal, goalNode){
        let time;
        let goalTimer = setInterval(() => {  
            // si le temps est écoulé on clear l'interval, sinon on remet à jour le temps
            if(timerMaster.timeout(goal.name)){
                sounds.goalsMaster.endinggoals();
                // clean goals dom
                goalNode.remove(goalNode);   
                // fin d'goals  dans le chat             
                this.socket.emit("GoalsMaster-end-goal", {goals : goal});
                clearInterval(goalTimer); 
            }else{
                time = timerMaster.getTime(goal.name);
                goalNode.innerText = `${time.min} min ${time.sec} sec`;
            }
        }, 1000);
        // ajout du timer au gestionnaire de timer
        this.goalTimer = goalTimer;
    }
}