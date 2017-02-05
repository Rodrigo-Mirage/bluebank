var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('db_bluebank');
var bodyParser = require('body-parser');

var contas = db.collection('t_accs');
var trans = db.collection('t_trans');

app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());

app.get('/getall',function(req,res){
  console.log("received");
    contas.find().toArray(function(err, results){
       if (!err && results === 0) {
          
       }else{

        console.log(results);
       }
    });
});
app.post('/getacc',function(req,res){
  console.log(req.body);
  var acc = {
      agencia:parseInt(req.body['ag']),
      conta:parseInt(req.body['acc']),
      cpf:parseInt(req.body['cpf'])
  };
  contas.findOne(acc,function(err, document) {
      if (document) {
        res.json(document);
      }
      else{
        res.json({mess:"Conta não encontrada"});
      }
   });
});

app.post('/confirm',function(req,res){
   var info={
       send:req.body['send'],
       rec:req.body['rec'],
       valor:parseInt(req.body['valor'])
   };
  trans.insert(info,function(err, result) {
    if (!err) {
        
      res.send({mess:"Transferência realizada"});
    }else{

      res.send({mess:"Ocorreu um erro na transferência"});
  }
  });
   
});


app.post('/sumary',function(req,res){

  var id = parseInt(req.body['id']);
    console.log(id);
  trans.find({$or:[{send:id},{rec:id}]} ,function(err, results){
       if (!err && results === 0) {
         
       }else{
        
        console.log(results);
        res.json(results);
       }
    });
});


app.listen(3000);