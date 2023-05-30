CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- a unique ID for each user, automatically incremented
    email VARCHAR(255) NOT NULL UNIQUE, -- a required email field that must be unique
    icon VARCHAR(2048),
    user_type TINYINT(8) NOT NULL DEFAULT 0 -- an optional field to indicate if the user is an admin or not );
);
CREATE TABLE bots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    botName VARCHAR(255) NOT NULL,
    userId INT,
    token VARCHAR(128),
    flow BYTEA,
);

