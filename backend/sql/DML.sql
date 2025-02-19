-- -----------------------------------------------------
-- SELECT Queries
-- -----------------------------------------------------
-- Query for retrieving all the class information for the Class list page
SELECT class_id, class_name AS name, class_description AS description FROM Classes
  ORDER BY class_id ASC;
-- Query for retrieving all the class IDs and names to use in the
-- Class dropdown for Character creation
SELECT class_id, class_name AS name FROM Classes
  ORDER BY class_name ASC;

-- Query for retrieving all the chest information and associated item names for the Chest list page
SELECT Chests.chest_id, TRIM(chest_x_coordinate)+0 AS 'x pos', TRIM(chest_y_coordinate)+0  AS 'y pos',
  GROUP_CONCAT(item_name ORDER BY item_Name ASC SEPARATOR ', ') AS contents FROM Chests
  INNER JOIN Chest_has_Items ON Chests.chest_id = Chest_has_Items.chest_id
  INNER JOIN Items ON Chest_has_Items.item_id = Items.item_id
  GROUP BY Chests.chest_id
  ORDER BY Chests.chest_id ASC;
-- Query for retrieving all the chest IDs and X/Y coordinates to
-- use in the Chest dropdown for updating the Chest_has_Items
-- junction table
SELECT chest_id, TRIM(chest_x_coordinate)+0 AS 'x pos',
  TRIM(chest_y_coordinate)+0  AS 'y pos' FROM Chests
  ORDER BY 'x pos' ASC, 'y pos' ASC;

-- Query for retrieving all the character information and associated item names, quest names,
-- and class names for the Character list page
SELECT Characters.character_id, character_name AS name, class_name AS class,
  IFNULL(GROUP_CONCAT(item_name ORDER BY item_Name ASC SEPARATOR ', '), '-') AS items,
  IFNULL(GROUP_CONCAT(quest_name ORDER BY quest_Name ASC SEPARATOR ', '), '-') AS quests
  FROM Characters
  INNER JOIN Classes ON Characters.class_id = Classes.class_id
  LEFT JOIN Quests ON Characters.character_id = Quests.character_id
  LEFT JOIN Character_has_Items ON Characters.character_id = Character_has_Items.character_id
  LEFT JOIN Items ON Character_has_Items.item_id = Items.item_id
  GROUP BY Characters.character_id
  ORDER BY Characters.character_id ASC;
-- Query for retrieving all the characters IDs and names to use in the
-- Character dropdown for Quest creation and updating the
-- Character_has_Items junction table
SELECT character_id, character_name AS name FROM Characters
  ORDER BY character_name ASC;

-- Query for retrieving all the quest information and associated item names and character names
-- for the Quest list page.
SELECT Quests.quest_id, quest_name AS name, quest_description AS description,
    IFNULL(character_name, '-') AS 'assigned to character',
    GROUP_CONCAT(item_name ORDER BY item_Name ASC SEPARATOR ', ') AS rewards FROM Quests
    INNER JOIN Items ON Quests.quest_id = Items.quest_id
    LEFT JOIN Characters ON Quests.character_id = Characters.character_id
    GROUP BY Quests.quest_id
    ORDER BY Quests.quest_id ASC;
-- Query for retrieving all the quest IDs and names to use in the
-- Quest dropdown for Item creation
SELECT quest_id, quest_name AS name FROM Quests
  ORDER BY quest_name ASC;

-- Query for retrieving all the item information and associated quest names, character names,
-- and chest coordinates for the Item list page.
SELECT Items.item_id, item_name AS name, item_description AS description,
    item_power AS power, item_range AS 'range', IFNULL(quest_name, '-') AS 'reward for quest',
    IFNULL(GROUP_CONCAT(DISTINCT character_name ORDER BY character_name ASC SEPARATOR ', '), '-')
        AS 'held by characters',
    IFNULL(GROUP_CONCAT(DISTINCT CONCAT('(', TRIM(chest_x_coordinate)+0, ', ', TRIM(chest_y_coordinate)+0, ')')
        ORDER BY chest_x_coordinate ASC, chest_y_coordinate ASC SEPARATOR ', '), '-')
        AS 'contained in chests at positions' FROM Items
    LEFT JOIN Quests ON Items.quest_id = Quests.quest_id
    LEFT JOIN Character_has_Items ON Items.item_id = Character_has_Items.item_id
    LEFT JOIN Characters ON Character_has_Items.character_id = Characters.character_id
    LEFT JOIN Chest_has_Items ON Items.item_id = Chest_has_Items.item_id
    LEFT JOIN Chests ON Chest_has_Items.chest_id = Chests.chest_id
    GROUP BY Items.item_id
    ORDER BY Items.item_id ASC;
-- Query for retrieving all the item IDs and names to use in the
-- Item dropdown for updating the Character_has_Items and
-- Chest_has_Items junction tables
SELECT item_id, item_name AS name FROM Items
  ORDER BY item_name ASC;

-- Query for retrieving all the Character has Items junction table information
-- and associated character names and item names for the Character has Items list page
SELECT Character_has_Items.character_has_items_id, character_name AS 'character name',
  item_name AS item FROM Character_has_Items
  INNER JOIN Characters ON Character_has_Items.character_id = Characters.character_id
  INNER JOIN Items ON Character_has_Items.item_id = Items.item_id
  GROUP BY Character_has_Items.character_has_items_id
  ORDER BY Character_has_Items.character_has_items_id ASC;

-- Query for retrieving all the Chest has Items junction table information
-- and associated chest coordinates and item names for the Chest has Items list page
SELECT Chest_has_Items.chest_has_items_id,
  CONCAT('(', TRIM(chest_x_coordinate)+0, ', ', TRIM(chest_y_coordinate)+0, ')') AS 'chest position',
  item_name AS item FROM Chest_has_Items
  INNER JOIN Chests ON Chest_has_Items.chest_id = Chests.chest_id
  INNER JOIN Items ON Chest_has_Items.item_id = Items.item_id
  GROUP BY Chest_has_Items.chest_has_items_id
  ORDER BY Chest_has_Items.chest_has_items_id ASC;

-- -----------------------------------------------------
-- INSERT Queries
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
-- DELETE Queries
-- -----------------------------------------------------
-- Query for removing a character with colon : character representing the variables
-- that will have data from the backend programming language
DELETE FROM Characters
WHERE character_id = :character_id_selected_from_browse_characters_page;

-- Query for removing an item association with a character from the Character_has_Items
-- junction table with colon : character representing the variables that will have data
-- from the backend programming language
DELETE FROM Character_has_Items
WHERE character_id = :character_id_selected_from_browse_character_has_items_page
  AND item_id = :item_id_selected_from_browse_character_has_items_page;

-- -----------------------------------------------------
-- UPDATE Queries
-- -----------------------------------------------------
-- Query for removing a character association with a quest by setting the foreign key
-- character_id in the Quests table to null with colon : character representing the variables
-- that will have data from the backend programming language
UPDATE Quests
SET character_id = NULL
WHERE quest_id = :quest_id_selected_from_browse_quests_page;

-- Query for updating an item/character association where the colon :
-- character represents the variables that will have data from the backend programming language
UPDATE Character_has_Items
SET character_id = :character_id_from_dropdown_input,
  item_id = :item_id_from_dropdown_input
WHERE character_id = :character_id_selected_from_browse_character_has_items_page
  AND item_id = :item_id_selected_from_browse_character_has_items_page;