-- Delete an association from the Character_has_Items table.
DELETE FROM Character_has_Items
WHERE character_id = :character_id_to_delete
  AND item_id = :item_id_to_delete;
-- Example: Remove the item association for a specific character.
