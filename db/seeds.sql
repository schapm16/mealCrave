USE mealcreave_db;
CREATE TABLE users(
	users_id int AUTO_INCREMENT,
	login varchar(30) not null,
	password varchar(30) not null,
	location varchar(30) not null,
	preferences varchar(30) not null,
	primary key (users_id)
);

CREATE TABLE food(
	food_id int AUTO_INCREMENT,
	name varchar(30) not null,
	photoUrl varchar(30) not null,
	price int not null,
	gluFree boolean,
	type varchar(10) not null,
	primary key (food_id)
);
CREATE TABLE locations(
	locations_id int AUTO_INCREMENT,
	location_name varchar(30) not null,
	gps_tag varchar(40) not null,
	primary key (locations_id)
);