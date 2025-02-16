import CRUDTable from "../components/CRUDTable";

const CharacterHasItems = () => {
  const fields = [
    {
      name: "character_has_items_id",
      label: "ID",
      type: "number",
      readOnly: true,
    },
    { name: "character_id", label: "Character", type: "select", options: [] },
    { name: "item_id", label: "Item", type: "select", options: [] },
  ];

  return (
    <CRUDTable
      title="Character Items"
      endpoint="Character_has_Items"
      fields={fields}
    />
  );
};

export default CharacterHasItems;
