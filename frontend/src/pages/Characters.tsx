import React from "react";
import CRUDTable from "../CRUDTable";

const charactersFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "class", label: "Class", type: "text" },
  // Add additional character fields as needed
];

const CharactersPage: React.FC = () => {
  return (
    <div>
      <CRUDTable title="Characters" endpoint="/api/characters" fields={charactersFields} />
    </div>
  );
};

export default CharactersPage;
