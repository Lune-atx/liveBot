const server = {
    port : 4000,
    init:()=>{
        let express = require("express");
        server.app = express();
        // pour charger fichiers en statique sinon 404 (et type mime invalides)
        server.app.use(express.static(__dirname+'/public'));
        server.http = require("http").Server(server.app);
        server.io = require("socket.io")(server.http);
        server.setRoutes();
        server.run();
        server.listen();        
    },   
    setRoutes:()=>{  
        server.app.get("/app", (req, res)=>{
            res.sendFile(__dirname+"/views/app.html");
        });
    },
    run:()=>{       
        server.http.listen(server.port, ()=>{
            console.log(`\n===( Server )=( port : ${server.port} )\n`);
        });       
    },
    listen:()=>{ 
        server.io.on("connection", (socket)=>{
            console.log("\na client is connected\n");
            socket.on("disconnect",()=>{
                console.log("\na client is disconnected\n");
            });
        });
    },
    send:(event, data)=>{
        console.log(`\n===( Event emited )=( ${event} )\n`);
        server.io.emit(event, data);
    }
}

module.exports = {
    server : server
}