//=======[ Settings, Imports & Data ]==========================================
var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    utils.query("Select * from Devices",function(err,ans){
        if(err){
            res.send(err).status(400);
            return;
        }
        res.send(ans);
    });

    /*devices = [
        { 
            'id': 1, 
            'name': 'Lampara 1', 
            'description': 'Luz living', 
            'state': 0, 
            'type': 1, 
        },
        { 
            'id': 2, 
            'name': 'Ventilador 1', 
            'description': 'Ventilador Habitacion', 
            'state': 1, 
            'type': 2, 
        },
    ]
    setTimeout(()=>{
        res.send(JSON.stringify(devices)).status(200);//Transforma el objeto JSON en string
    },2000);*/

});

app.get('/devices/:id', function(req, res) {
    let filter_data = devices.filter(item => item.id == req.params.id);
    utils.query("Select * from Devices where id = ? and nombre ?",[req.params.id, req.params.nombre],function(err,ans){
        if(err){
            res.send(err).status(400);
            return;
        }
        res.send(ans);
    });
});

app.post('/devices/', function(req, res) {
   // utils.query("Update Devices set state = ? where id = ? ",[req.body.state, req.body.id],function(err,ans){
      utils.query("INSERT INTO Devices (id,name,description,state,type) VALUES (?, ?, ?, ?, ?);",[req.body.id, req.body.name, req.body.description,req.body.state, req.body.type],function(err,ans){
        if(err){
            res.send(err).status(400);
            return;
        }
        res.send(ans);
        console.log("Resp post"+ans);
    });
});


app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
