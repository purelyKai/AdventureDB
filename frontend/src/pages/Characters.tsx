import CRUDTable from "../components/CRUDTable";

const fields = [
  { name: "character_id", label: "ID", type: "number", readOnly: true },
  { name: "character_name", label: "Name", type: "text" },
  { name: "class_id", label: "Class", type: "text" },
];

const CharactersPage: React.FC = () => {
  return (
    <div>
      <CRUDTable title="Characters" endpoint="characters" fields={fields} />
    </div>
  );
};

export default CharactersPage;
