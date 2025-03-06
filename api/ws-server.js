import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const wss = new WebSocketServer({ port: 3245 });

const debug = true;

const RandomColor = (min, max) => {
  
    const randomvalue = Math.floor( Math.random() * (max - min + 1) ) + min
    const color = [min, randomvalue ,max]
  
    //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    for (let i = color.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [color[i], color[j]] = [color[j], color[i]]
    }
    //color.sort(() => Math.random() - 0.5);
    return `rgb(${color.join(", ")})`;
  }

  
class User{
    constructor(name, ws){
        this.ws = ws
        this.name = name
        this.id = uuid()
        this.color = RandomColor(67, 224)
        this.currentChannel = null
        this.mute = true
    }

    setName(name) {this.name = name}

    send(data) {
        this.ws.send(JSON.stringify(data))
    }

    joinChannel(Channel){
        if (this.currentChannel) {
            this.currentChannel.removeUser(this)
        }

        Channel.addUser(this)
        this.currentChannel = Channel
        this.mute = false
    }
    leaveChannel(){
        if (this.currentChannel){
            this.currentChannel.deleteUser(this)
            this.currentChannel = null
            this.mute = true
        }
    }
}
class Channel{
    constructor(name, isDefault = false){
        this.name = name
        this.isDefault = isDefault  // false for community chans
        this.id = uuid()
        this.users = []
        this.history = []
    }


    broadcast(data){
        this.history.push(data)
        for (const user in this.users) {

            this.users[user].send(data);
        }
    }

    usersCount() { return this.users.length }
    usersGetAll() { 
        return this.users.map( (user) => ({
            username: user.name,
            color: user.color,
        }))
    }

    broadcastUserList() {
        this.broadcast({type: 'update', list: this.usersGetAll()})
    }

    addUser(user) {
        this.users.push(user)
        this.broadcast({ type: 'login', username: user.name, color: user.color, date: Date.now()})
        this.broadcastUserList()
        user.send({ type: 'history', message: this.history })
    }
    deleteUser(user){
        this.users = this.users.filter( (u) => u.id !== user.id )
        this.broadcast({type: 'disconnect', username: user.name, color: user.color, date: Date.now()})
        this.broadcastUserList()
    }

} 

const channels = [
    new Channel("Загальний чат", true), 
    new Channel("Оффтоп", true),
]

wss.on('connection', (ws) => {
  const user = new User('anonymous_user', ws)
  console.log(`Client ${user.id} connected`);

  ws.on('message', (rawMessage) => {
    const data = JSON.parse(rawMessage);
    if (!data.type) return;

    const HandleEvents = {
        'login': () => {
            user.setName(data.username);
            const channel = channels.find((c) => c.name === data.channelName);
            if (!channel) return // invalid channel err
            user.joinChannel(channel)

            if (debug) {
                console.log(`User ${user.name} has been connected to ${channel.name}`);
                console.log(`[DEBUG] Total users: ${user.currentChannel?.usersCount()}`); 
            }
        },
        
        // 'joinchannel': () => {
        //     const channel = channels.find((c) => c.name === data.channelName);
        //     if (!channel) return // invalid channel err
        //     user.joinChannel(channel)
        // },
        // 'leavechannel': () => {
        //     user.leaveChannel()
        // },
        'textmessage': () => {
            if (!user.currentChannel || user.mute) return console.log(`[BLOCK] Bloked message from ${user.name} [${user.mute, user.currentChannel}]`);
            const { message } = data;
            user.currentChannel.broadcast({ type: 'textmessage', username: user.name, message, color: user.color, date: Date.now()});
            if (debug) console.log(`[DEBUG] ${user.name}: ${message}`);
        },
        'getupdate': () => user.send({ type: 'update', list: user.currentChannel?.usersGetAll() || []}),

    }

    HandleEvents[data.type] && HandleEvents[data.type]()
  });

  ws.on('close', () => {
    user.leaveChannel()
  });

});

export function getChannelsList (){
    return channels.map( (channel) => ({
        name: channel.name,
        isDefault: channel.isDefault
    }))
}

export function createChannel(name){
    if ( channels.find((c) => c.name === name) ) return {responsetext:"channel_alreadyexist"}
    const createdChannel = new Channel(name)
    channels.push(createdChannel)
    return { responsetext: "channel_created", name: createdChannel.name}
}