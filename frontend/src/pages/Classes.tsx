import CRUDTable from "../components/CRUDTable";

const fields = [
  { name: "name", label: "Class Name", type: "text" },
  { name: "description", label: "Description", type: "text" },
];

const ClassesPage: React.FC = () => {
  return (
    <div>
      <CRUDTable title="Classes" endpoint="/api/classes" fields={fields} />
    </div>
  );
};

export default ClassesPage;
