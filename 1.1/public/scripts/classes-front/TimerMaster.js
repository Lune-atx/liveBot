export class TimerMaster {
    setTime(name, timming){               
        this[name]=Date.now()+timming*1000;
    }
    getTime(name){
        let time = {
            timestamp: this[name],
            week: Math.floor((this[name] - Date.now())/(1000*360*24*7)),
            day: Math.floor((this[name] - Date.now())/(1000*360*24)),
            hour: Math.floor((this[name] - Date.now())/(1000*360)),
            min: Math.floor((this[name] - Date.now())/(1000*60)),
            /**
             * On prend le timestamp auquel on retire le nombre de seconde écoulées. On a alors le total des secondes qu'il nous reste
             * [total millisecondes du compte à rebour] - [secondes passées]
             * this[name] - Date.now())/1000)
             * Puis on retire le nombre de minutes pleine afin d'avoir uniquement la partie des secondes restantes
             * [total des secondes]                     [Total des minutes]
             * (this[name] - Date.now())/1000)-Math.floor((this[name] - Date.now())/60000)*60)
             */
            sec: Math.floor(((this[name] - Date.now())/1000)-Math.floor((this[name] - Date.now())/60000)*60)
        };
       return time;
    }
    timeout(name){
        if(Date.now()>=this[name]){
            return true;
        }else{
            return false;
        }
    }
    dice(face){
        return Math.floor(Math.random()*face)+1;
    }
}