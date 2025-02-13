-- Update a record in Character_has_Items to remove the item association.
UPDATE Character_has_Items
SET item_id = NULL
WHERE character_has_items_id = :character_has_items_id_to_update;
-- This breaks the link between the character and the item while keeping the record for tracking purposes.
