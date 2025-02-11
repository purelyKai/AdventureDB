import CRUDTable from "../components/CRUDTable";

const Characters = () => {
  const fields = [
    { name: "character_id", label: "ID", type: "number", readOnly: true },
    { name: "character_name", label: "Name", type: "text" },
    { name: "class_id", label: "Class", type: "select", options: [] },
  ];

  return <CRUDTable title="Characters" endpoint="characters" fields={fields} />;
};

export default Characters;
