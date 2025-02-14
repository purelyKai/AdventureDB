import CRUDTable from "../components/CRUDTable";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "class", label: "Class", type: "text" },
];

const CharactersPage: React.FC = () => {
  return (
    <div>
      <CRUDTable
        title="Characters"
        endpoint="/api/characters"
        fields={fields}
      />
    </div>
  );
};

export default CharactersPage;
