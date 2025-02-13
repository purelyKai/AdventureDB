-- INSERT sample record into Classes.
INSERT INTO Classes (class_name, class_description)
VALUES (:class_name, :class_description);

-- INSERT sample record into Characters.
INSERT INTO Characters (character_name, class_id)
VALUES (:character_name, :class_id);

-- INSERT sample record into Quests.
INSERT INTO Quests (quest_name, quest_description, character_id)
VALUES (:quest_name, :quest_description, :character_id);

-- INSERT sample record into Items.
INSERT INTO Items (item_name, item_description, item_power, item_range, quest_id)
VALUES (:item_name, :item_description, :item_power, :item_range, :quest_id);

-- INSERT sample record into Chests.
INSERT INTO Chests (chest_x_coordinate, chest_y_coordinate)
VALUES (:chest_x_coordinate, :chest_y_coordinate);

-- INSERT sample record into Character_has_Items junction table.
INSERT INTO Character_has_Items (character_id, item_id)
VALUES (:character_id, :item_id);

-- INSERT sample record into Chests_has_Items junction table.
INSERT INTO Chests_has_Items (chest_id, item_id)
VALUES (:chest_id, :item_id);
