export const sounds = {
    /**
     * actions
     */
    actionsMaster: {
        fail: ()=>{
            let sound = new Audio("/../medias/sounds/ActionsMaster/fail.mp3");
            sound.volume = 0.5;
            sound.play();
        },
        lauching: ()=>{
            let sound = new Audio("/../medias/sounds/ActionsMaster/launching.mp3");
            sound.volume = 0.5;
            sound.play();
        },
        ending: ()=>{
            let sound = new Audio("/../medias/sounds/ActionsMaster/ending.mp3");
            sound.volume = 0.5;
            sound.play();
        },
        endingBeforeEnd: ()=>{
            let sound = new Audio("/../medias/sounds/ActionsMaster/endingBeforeEnd.mp3");
            sound.volume = 0.5;
            sound.play();
        }
    },
    goalMaster: {
        lauching: ()=>{
            let sound = new Audio("/../medias/sounds/GoalMaster/launching.mp3");
            sound.volume = 0.5;
            sound.play();
        },
        ending: ()=>{
            let sound = new Audio("/../medias/sounds/GoalMaster/ending.mp3");
            sound.volume = 0.5;
            sound.play();
        },
        endingBeforeEnd: ()=>{
            let sound = new Audio("/../medias/sounds/GoalMaster/endingBeforeEnd.mp3");
            sound.volume = 0.5;
            sound.play();
        }
    }
}