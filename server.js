const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const MongoClient = require('mongodb').MongoClient;

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
var db;
var colRooms;
var colUsers;
var colMessages;
var CheckError;
const uri = "mongodb+srv://mm1ne:334333m@m1ne.3iwfz.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.post('/signup', (req, res) => {
    const { userName, password } = req.body;
    colUsers.find({userName : userName}).toArray(function (err, user) {
        if (!user.length == 0) {
            CheckError = "Занято"
            res.status(202).send(CheckError);
        } else {
            let user = {
                userName: userName,
                password: password
            }
            colUsers.insertOne(user,
                function (err, result) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(200);
                    }
                })


        }
    })
})

app.post('/auth', (req, res) => {
    const { userName, password } = req.body;
    console.log(userName, password)
    colUsers.find({userName : userName}).toArray(function (err, user) {
        if (!user.length == 0) {
            if (user[0].password == password) {
                obj = {_id: user[0]._id, userName: user[0].userName }
                res.status(200).json(obj);
            } else {
                CheckError = "Неверный пароль"
                res.status(202).send(CheckError);
            }
        } else {
            CheckError = "Нет такого пользователя"
            res.status(202).send(CheckError);
        }
    })
})



app.get('/rooms', (req, res) => {

    colRooms.find({}).toArray(function (err, rooms) {
        res.status(200).json({ 'rooms': rooms });
    })
})

app.post('/rooms', (req, res) => {
    const { roomName, creator } = req.body;
    let room = {
        rName: roomName,
        creator: creator
    }
    colRooms.insertOne(room,
        function (err, result) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
        })
    res.send(room)
})




io.on('connection' , socket => {
    // socket.on('ROOM:JOIN' , ({ r_id , u_id }) => {
    //     console.log(r_id, u_id);
    //     socket.join(r_id);
    //     // colRooms.find({r_id : r_id}).toArray(function (err, room) {
    //     //     console.log(room[0].roomName)
           
    //     // })
        
       
    // });
    socket.on('CHECK' , ({r_id, u_id}) => {
        console.log("Работает?");
        socket.emit('Залупа');
        socket.emit('privki' , "Залупа")
        
       
    });

    socket.on('disconnect', () => {
        
    })



    console.log('user connected : ' , socket.id);
})





client.connect(err => {
    db = client.db("Chat");
    colRooms = db.collection('Rooms');
    colUsers = db.collection('Users');
    colMessages = db.collection('Users');
    server.listen(port, (err) => {
        if (err) {
            throw Error(err);
        }
        console.log(`Сервер запущен:${port}`);
    });
});