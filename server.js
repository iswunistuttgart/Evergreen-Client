var express = require('express');
var fs = require('fs');
var xml2js = require('xml2js');
parseString = require('xml2js').parseString;

// Create our app
var app = express();
const PORT = process.env.PORT || 3000;


var fs = require('fs'),
    parseString = require('xml2js').parseString;






//////////////// Read Serverlist.XML file and Sername
app.get('/readserverlist', (req, res) => {
  fs.readFile('serverlist.xml', 'utf-8', function(err, data) {
      if (err) console.log(err);
      // we log out the readFile results
      console.log(data);
      // we then pass the data to our method here
      parseString(data, function(err, result) {
          if (err) console.log(err);

          // here we log the results of our xml string conversion
          var serverList = result.serverlist.server;
          console.log('Serverlist: ', JSON.stringify(serverList) + '\n\n');

          // get the serverNames from json and save as array
          var serverNames = serverList.map((server) => {
              return server.serverName[0];
          });

          console.log('Servernames: ', serverNames );

          var object = {
              "serverlist" : serverNames,
              "errormessage" : "ERROR"
            };

          jsondata = JSON.stringify(object);
          console.log(jsondata);
          console.log(jsondata.serverlist);
          res.send(jsondata);
      });
  });

})







// //////////////Editing new JSON object and add server object to json
// app.post('/addserver', function(req, res) {
//
// });
//
// fs.readFile('serverlist0.xml', 'utf-8', function(err, data) {
//     if (err) console.log(err);
//     // we log out the readFile results
//     console.log(data);
//     // we then pass the data to our method here
//     parseString(data, function(err, result) {
//         if (err) console.log(err);
//         // here we log the results of our xml string conversion
//         var serverList = result.serverlist.server;
//         //get the serverNames from json and save as array
//         var serverNames = serverList.map((server) => {
//             return server.serverName[0];
//         });
//         //CHECK IF SERVERNAME EXISTS and Add server
//         function checkAndAdd(servername, serveradress, port) {
//             //var id = serverList.length + 1;
//             var found = serverList.some(function (serveritem) {
//                 return serveritem.serverName[0] === servername;
//             });
//            if (!found) { serverList.push({"serverName":[servername],"serverAdress":[serveradress],"port":[port]});
//                        }
//                             }
//         checkAndAdd(servername, serveradress, port);
//         // create a new builder object and then convert
//           // our json back to xml.
//           var builder = new xml2js.Builder();
//           var xml = builder.buildObject(result);
//           fs.writeFile('serverlist0.xml', xml, function(err, data){
//               if (err) console.log(err);
//               console.log("successfully written our update xml to file");
//           })
//       });
// });







// ///////////////Remove Server from Serverlist
//
// fs.readFile('serverlist0.xml', 'utf-8', function(err, data) {
//     if (err) console.log(err);
//     // we log out the readFile results
//     console.log(data);
//     // we then pass the data to our method here
//     parseString(data, function(err, result) {
//         if (err) console.log(err);
//
//
//         // here we log the results of our xml string conversion
//         var serverList = result.serverlist.server;
//
//
//         // get the serverNames from json and save as array
//         var serverNames = serverList.map((server) => {
//             return server.serverName[0];
//         });
//
//         // delete server from array
//         result.serverlist.server = serverList.filter(server =>
//          server.serverName[0] != "Lokal4"
//        );
//
//        // create a new builder object and then convert
//          // our json back to xml.
//          var builder = new xml2js.Builder();
//          var xml = builder.buildObject(result);
//
//          console.log(xml);
//          fs.writeFile('serverlist0.xml', xml, function(err, data){
//              if (err) console.log(err);
//
//              console.log("successfully written our update xml to file");
//          })
//
//
//
//     });
// });








//common pattern for express middleware => let us do something with every request
//req => index.html or bundle.js
//res => what cant sent back
//next => move on e.g call when middles is done
app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

app.use(express.static('public'));

app.listen(PORT, function() {
    console.log('Express server is up on port ' + PORT);
});
