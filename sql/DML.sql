-- -----------------------------------------------------
-- CS 340 - Portfolio Project Deliverables - DML
-- -----------------------------------------------------
--  This file contains the data manipulation queries that
--  are executed by our server-side code. The queries
--  include 5x SELECT's for each dropdown and 7x SELECT's,
--  INSERT's, UPDATE's, and DELETE's for each table.

-- -----------------------------------------------------
-- SELECT Queries - For dropdowns - 5x
-- -----------------------------------------------------
-- Query for retrieving all the class information to use in the
-- Class dropdown for Character creation
SELECT * FROM Classes
  ORDER BY class_name;

-- Query for retrieving all the chest information to use in the
-- Chest dropdown for updating the Chest_has_Items junction table
SELECT * FROM Chests
  ORDER BY chest_id;

-- Query for retrieving all the character information to use in the
-- Character dropdown for Quest creation and updating the
-- Character_has_Items junction table
SELECT * FROM Characters
  ORDER by character_name;

-- Query for retrieving all the quest information to use in the
-- Quest dropdown for Item creation
SELECT * FROM Quests
  ORDER by quest_name;

-- Query for retrieving all the item information to use in the
-- Item dropdown for updating the Character_has_Items and
-- Chest_has_Items junction tables
SELECT * FROM Items
  ORDER by item_name;

-- -----------------------------------------------------
-- SELECT Queries - For tables - 7x
-- -----------------------------------------------------
-- Query for retrieving all the class information for the Class list page
SELECT * FROM Classes
  ORDER BY class_id;

-- Query for retrieving all the chest information for the Chest list page
SELECT * FROM Chests
  ORDER BY chest_id;

-- Query for retrieving all the character information for the Character list page
SELECT * FROM Characters
  ORDER BY character_id;

-- Query for retrieving all the quest information for the Quest list page.
SELECT * FROM Quests
  ORDER BY quest_id;

-- Query for retrieving all the item information for the Item list page.
SELECT * FROM Items
  ORDER BY item_id;

-- Query for retrieving all the Character has Items junction table information
-- for the Character has Items list page
SELECT * FROM Character_has_Items
  ORDER BY character_has_items_id;

-- Query for retrieving all the Chest has Items junction table information
-- for the Chest has Items list page
SELECT * FROM Chest_has_Items
  ORDER BY chest_has_items_id;

-- -----------------------------------------------------
-- INSERT Queries - 7x
-- -----------------------------------------------------
-- Query for adding a new class with colon : character representing the variables
-- that will have data from the backend programming language
INSERT INTO Classes (class_name, class_description)
  VALUES (:class_name_input, :class_description_input);

-- Query for adding a new chest with colon : character representing the variables
-- that will have data from the backend programming language
INSERT INTO Chests (chest_x_coordinate, chest_y_coordinate)
  VALUES (:chest_x_coordinate_input, :chest_y_coordinate_input);

-- Query for adding a new character with colon : character representing the variables
-- that will have data from the backend programming language
INSERT INTO Characters (character_name, class_id)
  VALUES (:character_name_input, :class_id_from_dropdown_input);

-- Query for adding a new quest with colon : character representing the variables
-- that will have data from the backend programming language
INSERT INTO Quests (quest_name, quest_description, character_id)
  VALUES (:quest_name_input, :quest_description_input, :character_id_from_dropdown_input);

-- Query for adding a new item with colon : character representing the variables
-- that will have data from the backend programming language
INSERT INTO Items (item_name, item_description, item_power, item_range, quest_id)
  VALUES (:item_name_input, :item_description_input, :item_power_input, :item_range_input, :quest_id_from_dropdown_input);

-- Query for adding a new item association with a character to the Character_has_Items
-- junction table with colon : character representing the variables that will have data
-- from the backend programming language
INSERT INTO Character_has_Items (character_id, item_id)
  VALUES (:character_id_from_dropdown_input, :item_id_from_dropdown_input);

-- Query for adding a new item association with a chest to the Chest_has_Items
-- junction table with colon : character representing the variables that will have data
-- from the backend programming language
INSERT INTO Chest_has_Items (chest_id, item_id)
  VALUES (:chest_id_from_dropdown_input, :item_id_from_dropdown_input);

-- -----------------------------------------------------
-- DELETE Queries - 7x
-- -----------------------------------------------------
-- Query for removing a class with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Classes
  WHERE class_id = :class_id_selected_from_table;

-- Query for removing a chest with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Chests
  WHERE chest_id = :chest_id_selected_from_table;

-- Query for removing a character with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Characters
  WHERE character_id = :character_id_selected_from_table;

-- Query for removing a quest with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Quests
  WHERE quest_id = :quest_id_selected_from_table;

-- Query for removing an item with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Items
  WHERE item_id = :item_id_selected_from_table;

-- Query for removing an item association with a character from the Character_has_Items
-- junction table with colon : character representing the variables that will have data
-- from the backend programming language
DELETE FROM Character_has_Items
  WHERE character_has_items_id = :character_has_items_id_selected_from_table;

-- Query for removing an item association with a chest from the Chest_has_Items
-- junction table with colon : character representing the variables that will have data
-- from the backend programming language
DELETE FROM Chest_has_Items
  WHERE chest_has_items_id = :chest_has_items_id_selected_from_table;

-- -----------------------------------------------------
-- UPDATE Queries - 7x
-- -----------------------------------------------------
-- Query for updating all the values of a Class with colon : character representing
-- the variables that will have data from the backend programming language
UPDATE Classes
  SET class_name = :class_name_input,
    class_description = :class_description_input
  WHERE class_id = :class_id_selected_from_table;

-- Query for updating all the values of a Chest with colon : character representing
-- the variables that will have data from the backend programming language
UPDATE Chests
  SET chest_x_coordinate = :chest_x_coordinate_input,
    chest_y_coordinate = :chest_y_coordinate_input
  WHERE chest_id = :chest_id_selected_from_table;

-- Query for updating all the values of a Character with colon : character representing
-- the variables that will have data from the backend programming language
UPDATE Characters
  SET character_name = :character_name_input,
    class_id = :class_id_from_dropdown_input
  WHERE character_id = :character_id_selected_from_table;

-- Query for updating all the values of a Quest with colon : character representing
-- the variables that will have data from the backend programming language
UPDATE Quests
  SET quest_name = :quest_name_input,
    quest_description = :quest_description_input,
    character_id = :character_id_from_dropdown_input
  WHERE quest_id = :quest_id_selected_from_table;

-- Query for updating all the values of an Item with colon : character representing
-- the variables that will have data from the backend programming language
UPDATE Items
  SET item_name = :item_name_input,
    item_description = :item_description_input,
    item_power = :item_power_input,
    item_range = :item_range_input,
    quest_id = :quest_id_from_dropdown_input
  WHERE item_id = :item_id_selected_from_table;

-- Query for updating all the values of a Character has Items entry with colon :
-- character representing the variables that will have data from the backend
-- programming language
UPDATE Character_has_Items
  SET character_id = :character_id_from_dropdown_input,
    item_id = : item_id_from_dropdown_input
  WHERE character_has_items_id = :character_has_items_id_selected_from_table;

-- Query for updating all the values of a Chest has Items entry with colon :
-- character representing the variables that will have data from the backend
-- programming language
UPDATE Chest_has_Items
  SET chest_id = :chest_id_from_dropdown_input,
    item_id = : item_id_from_dropdown_input
  WHERE chest_has_items_id = :chest_has_items_id_selected_from_table;
