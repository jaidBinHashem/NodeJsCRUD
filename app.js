var http = require('http');
var fs = require('fs');
var Socketio = require('socket.io');
var db = require('./db');


/*** read static files for serving ***/
var readFile = (file, res) => fs.readFile("./views" + file, (err, data) =>
    err ? readFile('/404.html', res) : res.end(data + ""))

/*** create http server and serve files ***/
var server = http.createServer(function (req, res) {
    req.url === '/'
        ? readFile('/home.html', res)
        : readFile(req.url, res)
}).listen(3000);


var io = Socketio(server);

io.sockets.on('connection', function (socket) {

    /*** send data for home ***/
    socket.on('get data', function () {
        sql = "SELECT *  from details";
        db.fetchData(sql, function (data) {
            io.sockets.emit('incoming data', data);
        });
    });

    /*** add data ***/
    socket.on('add data', function (data, callback) {
        sql = 'INSERT INTO details (id, name, department, location) VALUES (NULL,"' + data.name + '", "' + data.department + '","' + data.location + '")';
        db.fetchData(sql, function (data) {
            callback(data.insertId);
        });
    });

    /*** delete data ***/
    socket.on('delete data', function (data, callback) {
        sql = 'DELETE FROM `details` WHERE `details`.`id` = ' + data.id;
        db.fetchData(sql, function () {
            callback();
        });
    });

    /*** edit data ***/
    socket.on('edit data', function (data) {
        sql = 'UPDATE `details` SET `name` = "' + data.name + '", `department` = "' + data.department + '", `location` = "' + data.location + '" WHERE `details`.`id` = "' + data.id + '"';
        db.fetchData(sql, function () {
            return;
        });
    });
});