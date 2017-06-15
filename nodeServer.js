var net= require('net');
var fs=require('fs');
var io = require('socket.io');



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

                        console.log(dataJSON); 	
                     //   app.get('/data.html', browserdisp );
	                     });

        });
var data_to_pod = {"Test1":"1","Test2":"2"};
var listener = io.listen(server);
listener.sockets.on('connection',function(socket_to_pod){

   setInterval(function(){
    socket_to_pod.emit('data_send',data_to_pod);
    console.log(typeof data_to_pod.Test1);
   },0); 


});

   

server.listen(3000,function (){
	var address=server.address().port;
	console.log("server is listening at "+address);
  //192.168.0.144
});



//Frontend - Webapp

function browserdisp(req,resp){
                        resp.send(JSON.stringify(dataJSON));
                       // if(req){var start=1;}
                      
                      }

var http = require("http");
var express=require('express');
var app=express();


     app.listen(2000,()=>{console.log("2000 server")});

app.get('/data.html', browserdisp );