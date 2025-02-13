import React from "react";
import CRUDTable from "../CRUDTable";

const classesFields = [
  { name: "name", label: "Class Name", type: "text" },
  { name: "description", label: "Description", type: "text" },
  // Add more fields as needed
];

const ClassesPage: React.FC = () => {
  return (
    <div>
      <CRUDTable title="Classes" endpoint="/api/classes" fields={classesFields} />
    </div>
  );
};

export default ClassesPage;
