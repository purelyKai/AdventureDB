export type Class = {
  class_id: number;
  class_name: string;
  class_description: string;
};

export type Chest = {
  chest_id: number;
  chest_x_coordinate: number;
  chest_y_coordinate: number;
};

export type Character = {
  character_id: number;
  character_name: string;
  class_id: number;
};

export type Quest = {
  quest_id: number;
  quest_name: string;
  quest_description: string;
  character_id: number | null;
};

export type Item = {
  item_id: number;
  item_name: string;
  item_description: string;
  item_power: number;
  item_range: number;
  quest_id: number | null;
};

export type CharacterHasItems = {
  character_has_items_id: number;
  character_id: number;
  item_id: number;
};

export type ChestHasItems = {
  chest_has_items_id: number;
  chest_id: number;
  item_id: number;
};

export interface Data {
  Classes: Class[];
  Chests: Chest[];
  Characters: Character[];
  Quests: Quest[];
  Items: Item[];
  Character_has_Items: CharacterHasItems[];
  Chest_has_Items: ChestHasItems[];
}
