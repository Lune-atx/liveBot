// SERVER
const importServer = require("./server");
const server = importServer.server;
server.init();

// TWITCHBOT
const importTwitchBot = require("./classes-back/TwitchBot");
const TwitchBot = importTwitchBot.class;
let twitchBot = new TwitchBot();

// REMOTE
const RemoteClass = require("./classes-back/Remote.js");
const Remote = RemoteClass.remote;
let remote = new Remote();

// EXPORTS
module.exports = {
    bot : twitchBot,
    remote : remote
};

/**
 * MASTERS
 */

// ACTIONSMASTER
const ActionsMasterClass = require("./classes-back/ActionsMaster.js");
const ActionsMaster = ActionsMasterClass.class;
let actionsMaster = new ActionsMaster();

// GOALSMASTER
const GoalsMasterClass = require("./classes-back/GoalMaster.js");
const GoalsMaster = GoalsMasterClass.class;
let goalsMaster = new GoalsMaster();

// REMOTEMASTER
const RemoteMasterClass = require("./classes-back/RemoteMaster.js");
const RemoteMaster = RemoteMasterClass.class;
let remoteMaster = new RemoteMaster();


