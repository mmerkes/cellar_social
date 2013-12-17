var mysql = require('mysql'),
	fs = require('fs'),
	async = require('async'),
	myConfig = require('./myConfig.js'),
	countries_path = __dirname + '/database_initializers/iso_country_codes_raw',
	varietals_path = __dirname + '/database_initializers/grape_varietals_raw';

var connection = mysql.createConnection( myConfig );

connection.connect( function(err) {
	if(err) {
		console.log(err);
	}
});

// Turn values into a query-friendly string
function escape_values( values ) {
	return connection.escape( values );
};

// Trim values to the limit specified
function trim_value( value, limit ) {
	return value.substring(0, limit);
};

// Create SQL INSERT INTO statement string
function create_insert_statement( table, values ) {
	return 'INSERT INTO ' + table + ' VALUES (NULL, ' + 
		escape_values(values) + ')';
};

// Create SQL SELECT statement string
function create_select_statement( table, field, value ) {
	return 'SELECT * FROM ' + table + ' WHERE ' + field +
		' = ' + escape_values(value);
};

// Take a table and the values, and insert a new row into a table
function insert_into( table, values ) {
	connection.query( create_insert_statement( table, values ), 
		function(err, rows, fields) {

	  	if(err) throw err;
	  	console.log(values);
	});
};

// Query the database to replace a string with the correct id
function get_id( table, field, value, callback ) {
	connection.query( create_select_statement( table, field, value),
		function(err, row) {
		
		if(err)
			throw err;

		callback( row[0].id );
	});
};

// read a file and return data
function read_file( filename ) {
	return fs.readFileSync( filename, {encoding: 'utf8'});
};

// take data from a file and convert it into an array
function split_file( data ) {
	return Array.prototype.map.call( data.split('\n'), function( dat ) {
		return dat.split('\t');
	});
};

// read a file and return it as an array
function convert_file( filename ) {
	return split_file( read_file( filename ));
};

// Populate the wine_categories table
var categories = [
	'red', 'white', 'rose', 'sparkling', 'fortified'
];

async.each( categories, function( category ) {
	insert_into( 'wine_categories', category );
}, function(err) {
	if(err)
		throw err;
});

// Populate the countries table
var countries = convert_file( countries_path );

async.each( countries, function(country) {
	country[1] = trim_value(country[1], 25);

	insert_into( 'countries', country );
}, function(err) {
	if(err)
		throw err;
});

//Populate the regions table
var regions = [
	['WASHINGTON', 'WA'],
	['OREGON', 'OR'],
	['CALIFORNIA', 'CA'],
	['NEW YORK', 'NY']
];

async.each( regions, function( region ) {
	insert_into( 'regions', region );
}, function(err) {
	if(err)
		throw err;
});

// Populate appellations
var appellations = [
	['Columbia Gorge', '', 'WA', 'US'],
	['Columbia Valley', '', 'WA', 'US'],
	['Puget Sound', '', 'WA', 'US'],
	['Columbia Valley', '', 'OR', 'US'],
	['Hood River County', '', 'OR', 'US'],
	['Willamette', '', 'OR', 'US'],
	['Napa County', '', 'CA', 'US'],
	['Sonoma County', '', 'CA', 'US'],
	['Hudson River Valley', '', 'NY', 'US'],
	['Niagara Escarpment', '', 'NY', 'US']
];

async.each( appellations, function( appellation ) {
	// Replace the country ISO code with the country_id
	get_id('countries', 'iso_code', appellation[3], function(country_id) {
		appellation[3] = country_id;

		// Replace the region abbreviation with the region_id
		get_id('regions', 'abbr', appellation[2], function(region_id) {
			appellation[2] = region_id;
			insert_into('appellations', appellation );
		});
	});
}, function(err) {
	if(err)
		throw err;
});

// Populate grape_varietals tables
var varietals = convert_file( varietals_path );

async.each( varietals, function( varietal ) {
	get_id( 'wine_categories', 'name', varietal[1], function(category_id) {
		varietal[1] = category_id;
		varietal.push('');
		varietal[0] = trim_value( varietal[0], 20);

		insert_into( 'grape_varietals', varietal );
	});	
}, function(err) {
	if(err)
		throw err;
});

// Populate producers table

// Populate wines table
/* SQL deletes
delete from appellations;
delete from grape_varietals;
delete from regions;
delete from countries;
delete from wine_categories;
*/

/*
reusable functions to add:
1. fetch_id from db
2. trim_value on capped names
3. read_file
4. format_data from read file
* find and replace tabs with ', ' in data files

*/
//connection.end();









