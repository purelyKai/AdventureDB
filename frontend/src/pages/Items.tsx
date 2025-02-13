import CRUDTable from "../components/CRUDTable";

const Items = () => {
  const fields = [
    { name: "item_id", label: "ID", type: "number", readOnly: true },
    { name: "item_name", label: "Name", type: "text" },
    { name: "item_description", label: "Description", type: "text" },
    { name: "item_power", label: "Power", type: "number" },
    { name: "item_range", label: "Range", type: "number" },
    { name: "quest_id", label: "Quest", type: "select", options: [] },
  ];

  return <CRUDTable title="Items" endpoint="items" fields={fields} />;
};

export default Items;
