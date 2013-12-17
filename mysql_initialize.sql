#CREATE DATABASE cellar_social;
#USE cellar_social;

# Create the varietal table
CREATE TABLE grape_varietals (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(20) UNIQUE, 
	category_id INT, 
	description TEXT,
	FOREIGN KEY (category_id)
		REFERENCES wine_categories(id)
);

# Create table to store wine varieties
CREATE TABLE wine_categories (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(10) UNIQUE
);

# Create table to store countries
CREATE TABLE countries (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	iso_code VARCHAR(2) UNIQUE,
	name VARCHAR(25) UNIQUE
);

# Create table to regions
CREATE TABLE regions (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(20),
	abbr VARCHAR(3),
	UNIQUE KEY (name, abbr)
);

# Create appelations table
CREATE TABLE appellations (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(35),
	description TEXT,
	region_id INTEGER,
	country_id INTEGER,
	FOREIGN KEY (region_id)
		REFERENCES regions(id),
	FOREIGN KEY (country_id)
		REFERENCES countries(id),
	UNIQUE KEY (name, region_id)
);

# Create producers table / also vineyards
CREATE TABLE producers (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	appellation_id INTEGER,
	name VARCHAR(35) UNIQUE,
	FOREIGN KEY (appellation_id)
		REFERENCES appellations(id)
);

# Create wines table
CREATE TABLE wines (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	producer_id INTEGER,
	name VARCHAR(50) UNIQUE,
	year YEAR,
	description TEXT,
	wine_category_id INT,
	FOREIGN KEY (producer_id)
		REFERENCES producers(id),
	FOREIGN KEY (wine_category_id)
		REFERENCES wine_categories(id)
);

# Create join table to store makeup of wines
CREATE TABLE wine_varietals (
	wine_id INTEGER,
	varietal_id INTEGER,
	percent DECIMAL(4,1),
	FOREIGN KEY (wine_id)
		REFERENCES wines(id),
	FOREIGN KEY (varietal_id)
		REFERENCES grape_varietals(id)
);

# Create users table, need to flesh out more
CREATE TABLE users (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(20),
	last_name VARCHAR(30),
	email VARCHAR(30) UNIQUE
);

# Create cellars table
CREATE TABLE cellars (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER,
	name VARCHAR(35),
	location VARCHAR(50),
	description TEXT,
	FOREIGN KEY (user_id)
		REFERENCES users(id)
);

# Create bottles table
CREATE TABLE bottles (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	wine_id INTEGER,
	cellar_id INTEGER,
	size INTEGER,
	price DECIMAL(7,2),
	notes TEXT,
	available BOOLEAN,
	FOREIGN KEY (wine_id)
		REFERENCES wines(id),
	FOREIGN KEY (cellar_id)
		REFERENCES cellars(id)
);

# Create ratings table
CREATE TABLE ratings (
	user_id INTEGER,
	wine_id INTEGER,
	rating INTEGER,
	remarks TEXT,
	FOREIGN KEY (user_id)
		REFERENCES users(id),
	FOREIGN KEY (wine_id)
		REFERENCES wines(id),
	PRIMARY KEY (user_id, wine_id)
);









