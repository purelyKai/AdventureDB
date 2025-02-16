import CRUDTable from "../components/CRUDTable";

const Characters = () => {
  const fields = [
    { name: "character_id", label: "ID", type: "number", readOnly: true },
    { name: "character_name", label: "Name", type: "text" },
    {
      name: "class_id",
      label: "Class",
      type: "text",
      foreignKey: true,
      optionsEndpoint: "Classes",
    },
  ];

  return <CRUDTable title="Characters" endpoint="Characters" fields={fields} />;
};

export default Characters;
