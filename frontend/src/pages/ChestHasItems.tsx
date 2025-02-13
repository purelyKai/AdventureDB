import CRUDTable from "../components/CRUDTable";

const ChestHasItems = () => {
  const fields = [
    { name: "chest_has_items_id", label: "ID", type: "number", readOnly: true },
    { name: "chest_id", label: "Chest", type: "select", options: [] },
    { name: "item_id", label: "Item", type: "select", options: [] },
  ];

  return (
    <CRUDTable title="Chest Items" endpoint="chest-has-items" fields={fields} />
  );
};

export default ChestHasItems;
