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
        this.sid = null
        this.color = RandomColor(67, 224)
        this.currentChannel = null
        this.mute = true
        this.isAdmin = null // only visible
    }

    get Info(){
        return {
            name: this.name,
            color: this.color,
            isAdmin: this.isAdmin
        }
    }

    setName(name) {this.name = name}

    send(data) {
        this.ws.send(JSON.stringify(data))
    }

    joinChannel(Channel){
        if (this.currentChannel) {
            this.currentChannel.deleteUser(this)
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
    constructor(name, isDefault = false, creatorSID){
        this.name = name
        this._logPrefix = `[#${this.name}]`
        this.isDefault = isDefault  // false for community chans
        this.id = uuid()
        this.creatorSID = creator
        
        this._Admin = null
        this.users = []
        
        this.history = []
        this._history_msglastID = 0
    }

    pushMessage(data){
        this._history_msglastID += 1
        data.id = this._history_msglastID
        this.history.push(data)
        return data
    }
    deleteMessage(user, msgID){
        // Add logging the deleted message content
        this.history.splice(msgID, 1)
        console.log(`${_logPrefix} ${user.name} deleted message ${msgID}.`)
    }

    broadcast(data){
        this.pushMessage(data)
        for (const user in this.users) {
            this.users[user].send(data);
        }
    }

    broadcastUserList() {
        this.broadcast({type: 'update', list: this.usersGetAll()})
    }

    addUser(user) {
        if (user.sid === this.creatorSID) this.Admin = user
        console.log(user.name, this.Admin, user.isAdmin)
        this.users.push(user)
        this.broadcast({ type: 'login', date: Date.now(), user: user.Info})
        this.broadcastUserList()
        user.send({ type: 'history', message: this.history })
    }
    deleteUser(user){
        this.users = this.users.filter( (u) => u.id !== user.id )
        this.broadcast({type: 'disconnect', date: Date.now(), user: user.Info})
        this.broadcastUserList()
    }

    usersCount() { return this.users.length }
    usersGetAll() { 
        return this.users.map( (user) => (user.Info))
    }


    get Admin () {
        return this._Admin
    }
    
    set Admin(user){
        if (!this.users.includes(user)) throw new Error(`${this._logPrefix} Attempt to set not exist user to Admin.`)
        
        if (this._Admin !== null){
            this._Admin.isAdmin = false
        }
        this._Admin = user
        user.isAdmin = true
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
            user.sid = data.sid
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
            user.currentChannel.broadcast({ type: 'textmessage', date: Date.now(), user: user.Info, message});
            if (debug) console.log(`[DEBUG] ${user.name}: ${message}`);
        },
        'getupdate': () => user.send({ type: 'update', list: user.currentChannel?.usersGetAll() || []}),

        'deletemessage': () => {
            if (user.currentChannel.Admin != user) throw new Error('[DeleteMessageERR] Attempt to delete message without admin permissions')
            const { msgID } = data
            user.currentChannel.deleteMessage( msgID )
        }
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
        online: channel.usersCount(),
        //users:,
        isDefault: channel.isDefault,
    }))
}

export function createChannel(name, creatorSID){
    if ( channels.find((c) => c.name === name) ) return {responsetext:"channel_alreadyexist"}
    const createdChannel = new Channel(name, false, creatorSID)
    channels.push(createdChannel)
    return { responsetext: "channel_created", name: createdChannel.name}
}