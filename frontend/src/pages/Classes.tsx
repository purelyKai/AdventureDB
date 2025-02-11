import CRUDTable from "../components/CRUDTable";

const Classes = () => {
  const fields = [
    { name: "class_id", label: "ID", type: "number", readOnly: true },
    { name: "class_name", label: "Name", type: "text" },
    { name: "class_description", label: "Description", type: "text" },
  ];

  return <CRUDTable title="Classes" endpoint="classes" fields={fields} />;
};

export default Classes;
