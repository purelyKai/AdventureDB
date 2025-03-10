import CRUDTable from "../components/CRUDTable";

const Items = () => {
  const fields = [
    {
      name: "item_id",
      label: "ID",
      type: "number",
      readOnly: true,
    },
    {
      name: "item_name",
      label: "Name",
      type: "text",
    },
    {
      name: "item_description",
      label: "Description",
      type: "text",
    },
    {
      name: "item_power",
      label: "Power",
      type: "number",
    },
    {
      name: "item_range",
      label: "Range",
      type: "number",
    },
    {
      name: "quest_id",
      label: "Quest",
      type: "select",
      foreignKey: true,
      optionsEndpoint: "Quests",
      selectTarget: "quest_name",
    },
  ];

  return <CRUDTable title="Items" endpoint="Items" fields={fields} />;
};

export default Items;
