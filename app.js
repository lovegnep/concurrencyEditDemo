const Koa = require('koa');
const app = new Koa();
const Route = require('koa-router');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const fs = require('fs');
const socket = require('./io');
const Static = require('koa-static');

socket.init(io);

let route = new Route();
route.get('/',async (ctx, next)=>{
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./static/index.html');

})
app.use(Static('./static'));
app.use(route.routes())

server.listen(3001);