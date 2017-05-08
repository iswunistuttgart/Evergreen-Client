var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var xml2js = require('xml2js');
parseString = require('xml2js').parseString;
var soap = require('soap');



// Create our app
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

var fs = require('fs'),
    parseString = require('xml2js').parseString;

//////////////// Read Serverlist.XML file and Sername
app.get('/readserverlist', (req, res) => {
  fs.readFile('serverlist0.xml', 'utf-8', function(err, data) {
    if (err)
      console.log(err);

    // we log out the readFile results
    console.log(data);
    // we then pass the data to our method here
    parseString(data, function(err, result) {
      if (err)
        console.log(err);

      // here we log the results of our xml string conversion
      var serverList = result.serverlist.server;
      console.log('Serverlist: ', JSON.stringify(serverList) + '\n\n');

      // get the serverNames from json and save as array
      var serverNames = serverList.map((server) => {
        return {
          serverName: server.serverName[0],
          serverAdress: server.serverAdress[0],
          port: server.port[0]
        };
      });

      console.log('Servernames: ', serverNames);

      var object = {
        "serverlist": serverNames,
        "errormessage": "ERROR"
      };

      jsondata = JSON.stringify(object);
      console.log(jsondata);
      console.log(jsondata.serverlist);
      res.send(jsondata);
    });
  });
})

app.use('/addserver', function(req, res) {

  if (!req.body.servername) {
    return res.status(400).send('servername missing!')
  }

  if (!req.body.serverip) {
    return res.status(400).send('serverip missing!')
  }

  if (!req.body.serverport) {
    return res.status(400).send('serverport missing!')
  }

  var servername = req.body.servername;
  var serveradress = 'http://' + req.body.serverip;
  var port = req.body.serverport;

  fs.readFile('serverlist0.xml', 'utf-8', function(err, data) {
    if (err) {
      return res.status(500).send('error occured at file system');
    }

    // we log out the readFile results
    console.log(data);
    // we then pass the data to our method here
    parseString(data, function(err, result) {
      if (err) {
        return res.status(500).send('error occured while parsing string');
      }

      // here we log the results of our xml string conversion
      var serverList = result.serverlist.server;
      //get the serverNames from json and save as array
      var serverNames = serverList.map((server) => {
        return server.serverName[0];
      });
      //CHECK IF SERVERNAME EXISTS and Add server
      function checkAndAdd(servername, serveradress, port) {
        //var id = serverList.length + 1;
        var found = serverList.some(function(serveritem) {
          return serveritem.serverName[0] === servername;
        });
        if (!found) {
          return serverList.push({"serverName": [servername], "serverAdress": [serveradress], "port": [port]});
        } else {
          return false;
        }
      }
      var checker = checkAndAdd(servername, serveradress, port);

      if (!checker)
        return res.status(400).send('Server already exists please type other name');

      // create a new builder object and then convert
      // our json back to xml.
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(result);
      fs.writeFile('serverlist0.xml', xml, function(err, data) {
        if (err) {
          return res.status(500).send('error occured at file system');
        }
        console.log("successfully written our update xml to file");
        res.send('success!')
      })
    });
  });
})

app.use('/removeserver', function(req, res) {

  if (!req.body.servername) {
    return res.status(400).send('servername missing!')
  }

  var servername = req.body.servername;

  fs.readFile('serverlist0.xml', 'utf-8', function(err, data) {
    if (err)
      console.log(err);

    // we log out the readFile results
    console.log(data);
    // we then pass the data to our method here
    parseString(data, function(err, result) {
      if (err)
        console.log(err);

      // here we log the results of our xml string conversion
      var serverList = result.serverlist.server;

      // get the serverNames from json and save as array
      var serverNames = serverList.map((server) => {
        return server.serverName[0];
      });

      // delete server from array
      result.serverlist.server = serverList.filter(server => server.serverName[0] != servername);

      // create a new builder object and then convert
      // our json back to xml.
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(result);

      console.log(xml);
      fs.writeFile('serverlist0.xml', xml, function(err, data) {
        if (err)
          console.log(err);

        res.send('success!')
        console.log("successfully written our update xml to file");
      })

    });
  });
})


app.use('/login', function (req, res) {
  if (!req.body.serveradress) {
    return res.status(400).send('serveradress missing!')
  }

  if (!req.body.port) {
    return res.status(400).send('port missing!')
  }

  if (!req.body.username) {
    return res.status(400).send('username missing!')
  }

  if (!req.body.password) {
    return res.status(400).send('password missing!')
  }

  fs.readFile('EvergreenWebService.wsdl', 'utf-8', function(err, data) {
    console.log('Err', err);

    if (err) return res.status(500).send('couldn\'t read file');

    parseString(data, function(err, result) {
      if (err)
        return res.status(500).send('couldn\'t parse');

        result['wsdl:definitions']['wsdl:service'][0]['wsdl:port'][0]['soap:address'][0]['$'].location =
        req.body.serveradress + ':' + req.body.port + '/malso/services/EvergreenWebService/';

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);

        fs.writeFile('EvergreenWebService.wsdl', xml, function(err, data) {
          if (err)
            return res.status(500).send('couldn\'t write file!')

          var args = {
            loginInformation: {
              UserName: req.body.username,
              UserPassword: req.body.password
            }
          }

          soap.createClient('./EvergreenWebService.wsdl', function (err, client) {
            if (err)
              return res.status(500).send('couldn\'t create soap client');

            client.Connection(args, function(err, response) {
              if (err)
                return res.status(500).send('error occured');

              if (response.errors && response.errors.Errors)
                return res.status(400).send(response.errors.Errors.ErrorMessage);

              if (!response.result)
                return res.status(500).send('something wrong');

              res.send(response.result);
            })
          })
        })
    });
  });
})

/////Login with username and password
// var url = './EvergreenWebService.wsdl';
// var args = {
//     loginInformation: {
//         UserName: 'admin',
//         UserPassword: 'admin'
//     }
// };
// soap.createClient(url, function(err, client) {
//     client.Connection(args, function(err, result) {
//         console.log(JSON.stringify(result));
//     });
// });


// ///Get All Groups and Sites
// var url = './EvergreenWebService.wsdl';
// var args = {
//     auth: {
//         AuthSession: 'exuieaoEiIgxIX4a2dREbbSqWy6yhK'
//     }
// };
// soap.createClient(url, function(err, client) {
//     client.GetUserPageConfig(args, function(err, result) {
//         //console.log(JSON.stringify(result));
//         var Title = result.Config.Groups[0].Title;
//         console.log(Title);
//
//     });
// });



///Modify (Add+Remove) Groups and Sites
// var url = './EvergreenWebService.wsdl';
// var args = {
//     auth: {
//         AuthSession: 'exuieaoEiIgxIX4a2dREbbSqWy6yhK'
//     },
//
//         NewConfig: {
//             OwnerId: 'admin',
//             Groups: [{
//                     Title: 'A',
//                     Index: 1,
//                     Pages: ['317', '321', '322', '327'],
//                 },
//                 {
//                     Title: 'B',
//                     Index: 2,
//                     Pages: ['323', '324', '329'],
//                 },
//                 {
//                     Title: 'D',
//                     Index: 3,
//                     Pages: ['325'],
//                 },
//                 {
//                     Title: 'E',
//                     Index: 4,
//                     Pages: [],
//                 },
//             ],
//         },
// };
//
// soap.createClient(url, function(err, client) {
//     client.ModifyUserPageConfig(args, function(err, result) {
//         console.log(JSON.stringify(result));
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
