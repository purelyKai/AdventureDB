import CRUDTable from "../components/CRUDTable";

const ChestHasItems = () => {
  const fields = [
    { name: "chest_has_items_id", label: "ID", type: "number", readOnly: true },
    {
      name: "chest_id",
      label: "Chest",
      type: "select",
      foreignKey: true,
      optionsEndpoint: "Chests",
    },
    {
      name: "item_id",
      label: "Item",
      type: "select",
      foreignKey: true,
      optionsEndpoint: "Items",
    },
  ];

  return (
    <CRUDTable title="Chest Items" endpoint="Chest_has_Items" fields={fields} />
  );
};

export default ChestHasItems;
