-- Variables for back‑end code are denoted by a colon (e.g., :variableName).

-- Create Classes table.
CREATE TABLE Classes (
    class_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(30) NOT NULL UNIQUE,
    class_description VARCHAR(255)
);

-- Create Characters table.
CREATE TABLE Characters (
    character_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    character_name VARCHAR(50) NOT NULL UNIQUE,
    class_id INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
);

-- Create Quests table.
CREATE TABLE Quests (
    quest_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    quest_name VARCHAR(50) NOT NULL UNIQUE,
    quest_description VARCHAR(255),
    character_id INT DEFAULT NULL,
    FOREIGN KEY (character_id) REFERENCES Characters(character_id) ON DELETE SET NULL
);

-- Create Items table.
CREATE TABLE Items (
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL UNIQUE,
    item_description VARCHAR(255),
    item_power INT NOT NULL,
    item_range INT,
    quest_id INT DEFAULT NULL,
    FOREIGN KEY (quest_id) REFERENCES Quests(quest_id) ON DELETE SET NULL
);

-- Create Chests table.
CREATE TABLE Chests (
    chest_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    chest_x_coordinate FLOAT NOT NULL,
    chest_y_coordinate FLOAT NOT NULL
);

-- Create junction table for the M:N relationship between Characters and Items.
CREATE TABLE Character_has_Items (
    character_has_items_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    character_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (character_id) REFERENCES Characters(character_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);

-- Create junction table for the M:N relationship between Chests and Items.
CREATE TABLE Chests_has_Items (
    chests_has_items_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    chest_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (chest_id) REFERENCES Chests(chest_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);
