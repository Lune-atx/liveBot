const OBSWebSocket = require('obs-websocket-js');

class remote {
    port = 4444;
    mdp = 'L49+^w9Xw';
    obs = new OBSWebSocket(); 
    scenes = [];

    constructor(){
        this.init(()=>{
            // set la première scène 
            this.send('SetCurrentScene',{
                'scene-name': this.scenes[0].name
            });
        });
       
    }

    init(callBack){
        this.obs.connect({
            address: `localhost:${this.port}`,
            password: this.mdp
        })
        .then(() => {
            console.log(`Success! We're connected & authenticated.`);
            return this.obs.send('GetSceneList');
        })
        .then(data => {  
            console.log(data);
            let dataIndex =  0; 
            data.scenes.forEach(scene => {
               this.scenes.push(scene);
               if(dataIndex >= data.scenes.length-1){
                   callBack();
               }else{
                    dataIndex ++;
               }
            });
        })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            console.log(err);
        });
    }

    send(event, data){
        this.obs.send(event, data);  
    }

    switchScene(sceneName){
        console.log(sceneName);
        // on vérifie la présence avant d'envoyer
        let isPresent = false;
        this.scenes.forEach(scene =>{
            if(scene.name == sceneName){
                this.send('SetCurrentScene',{
                    'scene-name': sceneName
                });
                isPresent == true;
            }
        });
        if(!isPresent){
            return false;
        }
        
    }

}

module.exports = {
    remote : remote
}