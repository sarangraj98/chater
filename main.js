
var io = io();

document.getElementById('bButton').addEventListener('click', registerBroadcast);
document.getElementById('send').addEventListener('click', sendBroadcast);


function sendBroadcast() {
    let message = document.getElementById('message').value;
    var ul = document.getElementById("bMessage");
    var li = document.createElement("li");
    li.className = "myOwn"
    li.appendChild(document.createTextNode(message));
    ul.appendChild(li);
    io.emit('broadcast',{msg:message})
    document.getElementById('myForm').reset();
    
}

io.on('message', function (data) {
    createLiElement(data.msg,data.admin)
    
    console.log(data)
})


function createLiElement(data,admin) {
    if(admin){
        var ul = document.getElementById("bMessage");
        var li = document.createElement("li");
        var small = document.createElement("small");
        var br = document.createElement("br")
        small.className = "kickout"
        small.appendChild(document.createTextNode("KICKOUT"))
        var a= document.createElement("a");
        a.href = "#"
        a.id = "kickOut"
        a.appendChild(small)
        li.appendChild(document.createTextNode(data));
        li.appendChild(a)
        ul.appendChild(li);
    }else{
        var ul = document.getElementById("bMessage");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(data));
        ul.appendChild(li);
    }

}


function registerBroadcast(){
    let name = document.getElementById('name').value;
    let region = document.getElementById('region').value
    document.getElementById("register").reset();
    io.emit('broadcastregister', { name: name, region: region })
    document.getElementById('register').style.display = "none";
    document.getElementById('chatBox').style.display = "block";
}

io.on('user_exist',function(data){
    alert(data.msg)
    window.location.href = "http://localhost:3000"
})