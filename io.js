const ChangeSets = require('./merge');

const UserMap = new Map(); // name => User
const SocketMap = new Map();
const Connected = [];

function init(io){
    io.on('connect',(socket)=>{
        console.log('client come');
        Connected.push(socket);
        Msgs.forEach((msgMap)=>{
            const {msg, handle} = msgMap;
            socket.on(msg, function(data){
                let user = SocketMap.get(socket);
                if(user){
                    console.log(`recv ${user.name}'s ${msg} `);
                }else{
                    console.log(`recv ${msg}`);
                }

                handle(socket,data);
            })
        })
    })
}

function User(socket, name){
    this.socket = socket;
    this.name=name
}

const Msgs = [
    {
        msg:"register",
        handle:function(socket,msg){
            if(!msg || msg.length < 1 || UserMap.get(msg)){
                return socket.emit('invlaidName');
            }
            let user = new User(socket, msg);
            UserMap.set(msg,user);
            SocketMap.set(socket, user);
            socket.emit('registerSuccess');
        }
    },{
        msg:"push",
        handle:function(socket, msg){
            ChangeSets.merge(msg);
            socket.broadcast.emit('pull',SocketMap.get(socket).name,msg);
        }
    },{
        msg:"get",
        handle:function(socket, msg){
            socket.emit('initget',ChangeSets.get());
        }
    },{
        msg:"disconnect",
        handle:function(socket){
            const user = SocketMap.get(socket);
            if(user){
                console.log(`client ${user.name} level`);
                UserMap.delete(user.name);
                SocketMap.delete(socket);
            }
            let index = Connected.findIndex((item)=>item===socket);
            index !== -1 && (Connected.splice(index,1))
        }
    },{
        msg:"error",
        handle:function(socket,err){
            const user = SocketMap.get(socket);
            if(user){
                console.log(`client ${user.name} error:`,err);
            }
        }
    }
]


exports = {
    init:init
};

Object.assign(module.exports, exports);
