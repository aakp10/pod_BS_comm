var net= require('net');
var fs=require('fs');
var formidable = require("formidable");
var io = require('socket.io');
//var io = require('socket.io');



// Backend Core Functionality
var team_id;
var  status;
var acceleration;
var position;
var velocity;
var battery_voltage;
var battery_current;
var battery_temperature;
var pod_temperature;
var stripe_count;

var no_data_packet =0;

var input_base = "NULL";

var dataJSON=new Object();
dataJSON={ "team_id":'0',
            "status":'0',
            "acceleration":'0',
            "position":'0',
            "velocity":'0',
            "battery_voltage":'0',
            "battery_current":'0',
            "battery_temperature":'0',
            "pod_temperature":'0',
            "stripe_count":'0'
        };
function unpack(arr) 
    {var count = 0;
        count+=arr[0]+arr[1]*256+arr[2]*256*256+arr[3]*256*256*256;    
return count;

     }
function unpack8(arr) 
    {var count = 0;
        count+=arr[0];
        return count;    
     }
                      
   

        var server=net.createServer(function (socket) {
               // socket.setEncoding('utf8');
                	socket.on('error',function (){
                		console.log("error occured");
                	});
                	socket.on('end',function (){
                		console.log("ended");
                	});


                	socket.on('data',function (data){

        				
                		
                		//console.dir(data);
                		var arr = Array.prototype.slice.call(data, 0,1);
                		 dataJSON.team_id=unpack8(arr);
                        arr = Array.prototype.slice.call(data, 1,2);
                         dataJSON.status=unpack8(arr);
                         arr = Array.prototype.slice.call(data, 2,6);
                        dataJSON.acceleration=unpack(arr);
                         arr = Array.prototype.slice.call(data, 6,10);
                         dataJSON.position =unpack(arr);
                        arr = Array.prototype.slice.call(data, 10,14);
                         dataJSON.velocity=unpack(arr);
                         arr = Array.prototype.slice.call(data,14,18);
                        dataJSON.battery_voltage=unpack(arr);
                         arr = Array.prototype.slice.call(data, 18,22);
                         dataJSON.battery_current=unpack(arr);
                          arr = Array.prototype.slice.call(data, 22,26);
                         dataJSON.battery_temperature=unpack(arr);
                         arr = Array.prototype.slice.call(data, 26,30);
                        dataJSON.pod_temperature=unpack(arr);
                         arr = Array.prototype.slice.call(data,30,34);
                        dataJSON.stripe_count=unpack(arr);

                        no_data_packet = no_data_packet +1;
                        //console.log(no_data_packet)
                        console.log("Data Packet No."+ no_data_packet)
                        console.log(dataJSON); 	

                        socket.write(input_base);
                     //   app.get('/data.html', browserdisp );
	                     });

        });
/*var data_to_pod = {"Test1":"1","Test2":"2"};
var listener = io.listen(server);
listener.sockets.on('connection',function(socket_to_pod){

   setInterval(function(){
    socket_to_pod.emit('data_send',data_to_pod);
    console.log(typeof data_to_pod.Test1);
   },0); 


});*/

   

server.listen(3000,function (){
	var address=server.address().port;
	console.log("server is listening at "+address);
  //192.168.0.144
});



//Frontend - Webapp

/*function browserdisp(req,resp){
                        resp.send(JSON.stringify(dataJSON));
                       // if(req){var start=1;}
                      
                      }*/

var http = require("http");
var express=require('express');
var app=express();

var server1 = http.createServer(app);
     //app.listen(2000,()=>{console.log("2000 server")});

//app.get('/data.html', browserdisp );

app.get('/', function (req,res){

    res.send("Base Station!");

});

app.get('/index.html',function(req,res){
    

    fs.readFile( __dirname + "/index.html",function(error,data){               
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(data, "utf8");
                    res.end();
                    });

});

app.post('/index.html',function(request,response){

                    console.log("Got Post!!");
                    var form = new formidable.IncomingForm();
                    

                    form.parse(request,function(err,field){

                        // change input_newsong to LIST
                        input = field;
                        console.log(input.ping1);
                        input_base = input.ping1;
                        



                    fs.readFile(__dirname + "/index.html",function(error,data){               
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                    });

                     
                    
                    })

                });


var listener = io.listen(server1);
listener.sockets.on('connection', function(socket){

    socket.on('join', function(data_client) {
        console.log(data_client);
        console.log("Client Connected!!")
    });

   

    setInterval(function(){
        socket.emit('data_send', {'data_from_pod': dataJSON["team_id"]});
    }, 0);

});


server1.listen(8081,"0.0.0.0");
console.log("Server listening at 8081")