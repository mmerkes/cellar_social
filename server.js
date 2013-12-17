var application_root = __dirname,
	express = require('express'),
	path = require('path'),
	mysql = require('mysql'),
	myConfig = require('./myConfig.js');

var connection = mysql.createConnection( myConfig );

connection.connect( function(err) {
	if(err) {
		console.log(err);
	}
});

connection.query('SELECT * FROM wines', function(err, rows, fields) {
  if (err) throw err;

  console.log(rows);
});

connection.end();

