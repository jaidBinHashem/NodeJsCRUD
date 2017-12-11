var mysql = require('mysql');

module.exports = {
    fetchData: function (sql, callback) {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'employee'
        });

        connection.connect(function (err) {
            if (err) {
                console.log('error connecting database ...');
            } else{
                connection.query(sql, function (err, result) {
                    callback(result);
                });
            }
        });
    }
};