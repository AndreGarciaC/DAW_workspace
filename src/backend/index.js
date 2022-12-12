/**
 * index.js 
 *
 * @link   https://github.com/AndreGarciaC/DAW_workspace/blob/master/src/backend/index.js
 * @file   This file defines the backend code to interact with the dataBase.
 * @author Brian Ducca, Andrea García.
 * @since  2022.10.17
 */
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

/**
 * Consulta para obtener todos los elementos de tabla Devices.
 */
app.get('/devices/', function(req, res, next) {
    utils.query("Select * from Devices",function(err,ans){
        if(err){
            res.send(err).status(400);
            return;
        }
        res.send(ans);
    });

});

/**
 * Consulta para obtener un elemento de la tabla Devices.
 */
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

/**
 * Consulta para insertar un elemento en la tabla Devices.
 */
app.post('/devices/', function(req, res) {
      utils.query("INSERT INTO Devices (id,name,description,state,type) VALUES (?, ?, ?, ?, ?);",[req.body.id, req.body.name, req.body.description,req.body.state, req.body.type],function(err,ans){
        if(err){
            res.send(err).status(400);
            return;
        }
        res.send(ans);
        console.log("Resp post"+ans);
    });
});

/**
 * Consulta para eliminar un elemento de la tabla Devices.
 */
app.delete('/devices/', function(req, res) {
    console.log("Eliminar disp id= "+req.body.id);
    utils.query("DELETE FROM Devices WHERE id = ?;",[req.body.id],function(err,ans){
      if(err){
          res.send(err).status(400);
          return;
      }
      res.send(ans);
      console.log("Resp post"+ans);
  });
});

/**
 * Consulta para actualizar un elemento de la tabla Devices.
 */
app.put('/devices/', function(req, res) {
    console.log("Update disp id= "+req.body.id);
    utils.query("UPDATE Devices SET state = ? WHERE id = ?;",[req.body.state,req.body.id],function(err,ans){
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
