const app = require('express')();
const express = require('express')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const pug = require('pug')
const session = require('express-session')
const passport = require('passport');
const { connect } = require('ngrok');

var db = []
app.use(express.static(__dirname));
app.set('view engine', 'pug');
app.set('views', './pages')
app.use(session({
    secret: 'simpletest',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.sendFile('./index.html');
});
app.get('/in', (req, res) => {
    console.log(req.session)
    res.render('index')
})

io.on('connection', function (socket) {
    
    socket.on('disconnect', function () {
       
    });
    socket.on('broadcast', function (data) {
        let region = db.filter(function (item) {
            if (item.id == socket.id) {
                return (item.region)
            }
        });
        
        try {
            socket.to(region[0].region).emit('message', { msg: `[${region[0].name}]:${data.msg}`,socketId:socket.id })
        } catch (error) {
            console.log(error)
        }

    })
    socket.on('kickOut',function(data){
        
        io.to(data.id).emit('kickyourself');
    })
    socket.on('kickMe',function(data){
        console.log('working')
        try {
            socket.leave(data.region);
            socket.emit('kickedOut')
            socket.to(data.region).emit('kickedoutNotification',{msg:`Admin kicked out ${data.name}`})
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('broadcastregister', function (data) {
        //socket.broadcast.emit('message',{msg:data.msg})
        const check = db.find((item)=>{
            var n1 = item.name
            var n2 = data.name
            if(n1.toLowerCase()==n2.toLowerCase()){
                return true
            }
        })
        if (check) {
            socket.emit('user_exist',{msg:'Please use another name !'})
        } else {
            let datas = {}
            datas.name = data.name
            datas.region = data.region
            datas.id = socket.id
            if(data.name.toLowerCase()=='sarang'){
                datas.admin=true
                socket.emit('adminResponce',{admin:true})

            }
            socket.emit('details',datas)
            db.push(datas)
            socket.join(data.region)
            
        }
        




    })
});

app.get('/broadcast', (req, res) => {
    console.log(req.body)
})


http.listen(3000, console.log('Server running on 3000'))
