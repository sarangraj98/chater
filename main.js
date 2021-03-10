
var io = io();

document.getElementById('bButton').addEventListener('click', registerBroadcast);
document.getElementById('send').addEventListener('click', sendBroadcast);


function sendBroadcast() {
    let message = document.getElementById('message').value;
    io.emit('broadcast',{msg:message})
    document.getElementById('myForm').reset();
    
}

io.on('message', function (data) {
    createLiElement(data.msg)
    console.log(data)
})


function createLiElement(data) {
    var ul = document.getElementById("bMessage");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(data));
    ul.appendChild(li);

}


function registerBroadcast(){
    let name = document.getElementById('name').value;
    let region = document.getElementById('region').value
    document.getElementById("register").reset();
    io.emit('broadcastregister', { name: name, region: region })
    document.getElementById('register').style.display = "none";
    document.getElementById('chatBox').style.display = "block";
}