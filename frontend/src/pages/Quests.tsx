import CRUDTable from "../components/CRUDTable";

const Quests = () => {
  const fields = [
    { name: "quest_id", label: "ID", type: "number", readOnly: true },
    { name: "quest_name", label: "Name", type: "text" },
    { name: "quest_description", label: "Description", type: "text" },
    { name: "character_id", label: "Character", type: "select", options: [] },
  ];

  return <CRUDTable title="Quests" endpoint="quests" fields={fields} />;
};

export default Quests;
