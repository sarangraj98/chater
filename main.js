
var io = io();
var admin = false
var region = null
var userName = null
document.getElementById('bButton').addEventListener('click', registerBroadcast);
document.getElementById('send').addEventListener('click', sendBroadcast);


function sendBroadcast() {
    if (document.getElementById("message").value == "") {
        alert("Please enter mesage");

    } else {
        let message = document.getElementById('message').value;
        var ul = document.getElementById("bMessage");
        var li = document.createElement("li");
        li.className = "myOwn"
        li.appendChild(document.createTextNode(message));
        ul.appendChild(li);
        io.emit('broadcast', { msg: message })
        document.getElementById('myForm').reset();
    }

}

io.on('message', function (data) {
    createLiElement(data)
    console.log(data)
})

io.on('kickyourself', function () {
    console.log('Kicking')
    io.emit('kickMe', { region: region, name: userName })
})
io.on('kickedOut', function () {
    alert('You are kicked out by admin !');
    window.location.href = "http://localhost:3000"
})
io.on('kickedoutNotification', function (data) {
    var ul = document.getElementById("bMessage");
    var li = document.createElement("li");
    li.className = "alert"
    li.appendChild(document.createTextNode(data.msg));
    ul.appendChild(li);
})
function createLiElement(data) {
    if (admin) {
        var ul = document.getElementById("bMessage");
        var li = document.createElement("li");
        var small = document.createElement("small");
        var br = document.createElement("br")
        small.className = "kickout"
        small.appendChild(document.createTextNode("KICKOUT"))
        var a = document.createElement("a");
        a.href = "#"
        a.id = data.socketId
        let socketId = data.socketId
        a.onclick = function () {
            io.emit('kickOut', { id: socketId })
        }
        a.appendChild(small);
        li.appendChild(document.createTextNode(data.msg));
        li.appendChild(a);
        ul.appendChild(li);
    } else {
        var ul = document.getElementById("bMessage");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(data.msg));
        ul.appendChild(li);
    }

}


function registerBroadcast() {
    let name = document.getElementById('name').value;
    let region = document.getElementById('region').value
    document.getElementById("register").reset();
    io.emit('broadcastregister', { name: name, region: region })
    document.getElementById('register').style.display = "none";
    document.getElementById('chatBox').style.display = "block";
}

io.on('user_exist', function (data) {
    alert(data.msg)
    window.location.href = "http://localhost:3000"
})

io.on('adminResponce', function (data) {
    admin = data.admin
})

io.on('details', function (data) {
    region = data.region
    userName = data.name
})