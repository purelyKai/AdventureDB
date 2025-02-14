import CRUDTable from "../components/CRUDTable";

const fields = [
  { name: "class_id", label: "ID", type: "number", readOnly: true },
  { name: "class_name", label: "Class Name", type: "text" },
  { name: "class_description", label: "Description", type: "text" },
];

const ClassesPage: React.FC = () => {
  return (
    <div>
      <CRUDTable title="Classes" endpoint="/api/classes" fields={fields} />
    </div>
  );
};

export default ClassesPage;
