Create database db_pokemon;
USE db_pokemon;

CREATE TABLE Town (
    t_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    t_name VARCHAR(20)
);

CREATE TABLE Trainer (
    tr_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tr_name VARCHAR(20),
    town_id INT,
    FOREIGN KEY(town_id) REFERENCES Town(t_id)
);

CREATE TABLE Pokemon_Type (
    ty_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20)
);

CREATE TABLE Pokemon (
    p_id INT(20) PRIMARY KEY,
    p_name VARCHAR(30),
    p_height INT(10),
    p_weight INT(10),
    type_id INT(10),
    FOREIGN KEY(type_id) REFERENCES Pokemon_Type(ty_id)
);

CREATE TABLE Pokemon_Trainer (
    p_id INT,
    tr_id INT,
    FOREIGN KEY(p_id) REFERENCES Pokemon(p_id),
    FOREIGN KEY(tr_id) REFERENCES Trainer(tr_id),
    PRIMARY KEY(p_id,tr_id)
);
