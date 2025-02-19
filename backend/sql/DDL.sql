-- Temporarily remove key checks and autocommit
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Remove tables if they already exist
DROP TABLE IF EXISTS `Classes`;
DROP TABLE IF EXISTS `Chests`;
DROP TABLE IF EXISTS `Characters`;
DROP TABLE IF EXISTS `Quests`;
DROP TABLE IF EXISTS `Items`;
DROP TABLE IF EXISTS `Character_has_Items`;
DROP TABLE IF EXISTS `Chest_has_Items`;

-- -----------------------------------------------------
-- Create Table `Classes`
-- A class can be associated with many characters
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Classes` (
  `class_id` INT NOT NULL AUTO_INCREMENT,
  `class_name` VARCHAR(30) NOT NULL UNIQUE,
  `class_description` VARCHAR(255),
  PRIMARY KEY (`class_id`)
);

-- -----------------------------------------------------
-- Create Table `Chests`
-- A chest must have at least one item and there can
-- be duplicate items among chests
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Chests` (
  `chest_id` INT NOT NULL AUTO_INCREMENT,
  `chest_x_coordinate` DECIMAL(10,5) NOT NULL,
  `chest_y_coordinate` DECIMAL(10,5) NOT NULL,
  PRIMARY KEY (`chest_id`),
  CONSTRAINT chest_full_coordinates UNIQUE (chest_x_coordinate, chest_y_coordinate)
);

-- -----------------------------------------------------
-- Create Table `Characters`
-- A character can have multiple items and multiple
-- quests, but must have one class. There can be duplicate
-- items among characters, but not duplicate quests
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Characters` (
  `character_id` INT NOT NULL AUTO_INCREMENT,
  `character_name` VARCHAR(50) NOT NULL UNIQUE,
  `class_id` INT NOT NULL,
  PRIMARY KEY (`character_id`),
  FOREIGN KEY (`class_id`) REFERENCES `Classes` (`class_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Create Table `Quests`
-- A quest must give at least one item and can be associated
-- with a max of one character. There can't be duplicate item
-- rewards among quests
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Quests` (
  `quest_id` INT NOT NULL AUTO_INCREMENT,
  `quest_name` VARCHAR(50) NOT NULL UNIQUE,
  `quest_description` VARCHAR(255),
  `character_id` INT NULL,
  PRIMARY KEY (`quest_id`),
  FOREIGN KEY (`character_id`) REFERENCES `Characters` (`character_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Create Table `Items`
-- An item can be associated with multiple characters and
-- multiple chests, but can only be associated with a max
-- of 1 quest
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Items` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `item_name` VARCHAR(50) NOT NULL UNIQUE,
  `item_description` VARCHAR(255),
  `item_power` INT NOT NULL,
  `item_range` INT,
  `quest_id` INT NULL,
  PRIMARY KEY (`item_id`),
  FOREIGN KEY (`quest_id`) REFERENCES `Quests` (`quest_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Create Table `Character_has_Items`
-- Each entry must have a link to a character and item,
-- but not every character and item will have an entry
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Character_has_Items` (
  `character_has_items_id` INT NOT NULL AUTO_INCREMENT,
  `character_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  PRIMARY KEY (`character_has_items_id`),
  FOREIGN KEY (`character_id`) REFERENCES `Characters` (`character_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`item_id`) REFERENCES `Items` (`item_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `Chest_has_Items`
-- Each entry must have a link to a chest and item,
-- but not every item will have an entry. Every chest must
-- have an entry since each chest must give at least one item.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Chest_has_Items` (
  `chest_has_items_id` INT NOT NULL AUTO_INCREMENT,
  `chest_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  PRIMARY KEY (`chest_has_items_id`),
  FOREIGN KEY (`chest_id`) REFERENCES `Chests` (`chest_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`item_id`) REFERENCES `Items` (`item_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Inserting sample data into 'Classes' table
INSERT INTO `Classes` (`class_id`, `class_name`, `class_description`) VALUES
(1, 'Wizard', 'Harness the power of magic and unleash your wrath'),
(2, 'Undead', 'Live past death and carry on into the next life'),
(3, 'Human', 'Regular human with nothing special');

-- Inserting sample data into 'Chests' table
INSERT INTO `Chests` (`chest_id`, `chest_x_coordinate`, `chest_y_coordinate`) VALUES
(1, 50.0, 90.0),
(2, 300.5, 20.5),
(3, 750.5, 320.25);

-- Inserting sample data into 'Characters' table
INSERT INTO `Characters` (`character_id`, `character_name`, `class_id`) VALUES
(1, 'magic4Life', 1),
(2, 'sorceryIsWild99', 1),
(3, 'simpleHuman29', 3),
(4, 'fastHuman36', 3);

-- Inserting sample data into 'Quests' table
INSERT INTO `Quests` (`quest_id`, `quest_name`, `quest_description`, `character_id`) VALUES
(1, 'Save the village', 'Release the villagers from the prisons and stop the pillaging of their town', 2),
(2, 'Supreme gardening', 'Garden 100 acres of land and harvest crops for the villagers', 2),
(3, 'Find the lost cave', 'Search the lands between to find the hidden cave that holds unknown treasures', NULL),
(4, 'Slay the wild beast', 'Harness the power of your weapons to slay the mighty beast', 3);

-- Inserting sample data into 'Items' table
INSERT INTO `Items` (`item_id`, `item_name`, `item_description`, `item_power`, `item_range`, `quest_id`) VALUES
(1, 'Diamond Sword', 'Made of diamonds', 8, 4, NULL),
(2, 'Diamond Hoe', 'The most valuable gardening item', 7, 2, 2),
(3, 'Emerald Sword', 'The sword carried by the wealthiest villagers', 10, 5, 1),
(4, 'Steel Bow', 'Crafted from molten rock from the center of the Earth', 6, 20, 4),
(5, 'Battle Axe', 'Stolen from the great vikings of the west', 12, 2, 3),
(6, 'Throwing Dagger', 'Given by the assassins of the great creed', 5, 15, 3);

-- Inserting sample data into 'Character_has_Items' table
INSERT INTO `Character_has_Items` (`character_id`, `item_id`) VALUES
(1, 1),
(1, 2),
(3, 2);

-- Inserting sample data into 'Chest_has_Items' table
INSERT INTO `Chest_has_Items` (`chest_id`, `item_id`) VALUES
(1, 1),
(1, 3),
(2, 1),
(3, 2);

-- Display all table contents
SELECT * FROM `Classes`;
SELECT * FROM `Chests`;
SELECT * FROM `Characters`;
SELECT * FROM `Quests`;
SELECT * FROM `Items`;
SELECT * FROM `Character_has_Items`;
SELECT * FROM `Chest_has_Items`;

-- Reset key checks and autocommit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;