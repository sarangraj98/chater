const app = require('express')();
const express = require('express')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const pug = require('pug')
const session = require('express-session')
const passport = require('passport')

var db = []
app.set('view engine', 'pug');
app.set('views', './pages')
app.use(session({
    secret: 'simpletest',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session())
app.get('/', (req, res) => {
    res.sendFile('./index.html');
});
app.get('/in', (req, res) => {
    console.log(req.session)
    res.render('index')
})

io.on('connection', function (socket) {
    console.log(`A user connected on ${socket.id}`);

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    socket.on('broadcast', function (data) {
        let region = db.filter(function (item) {
            if (item.id == socket.id) {
                return (item.region)
            }
        });
        console.log(region)
        try {
            socket.to(region[0].region).emit('message', { msg: `[${region[0].name}]:${data.msg}` })
        } catch (error) {
            console.log(error)
        }

    })
    socket.on('broadcastregister', function (data) {
        //socket.broadcast.emit('message',{msg:data.msg})
        console.log(data)
        let datas = {}
        datas.name = data.name
        datas.region = data.region
        datas.id = socket.id
        db.push(datas)
        socket.join(data.region)
        console.log(db)

    })
});

app.get('/broadcast', (req, res) => {
    console.log(req.body)
})

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

http.listen(3000, console.log('Server running on 3000'))
