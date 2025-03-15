import CRUDTable from "../components/CRUDTable";

const Quests = () => {
  const fields = [
    {
      name: "quest_id",
      label: "ID",
      type: "number",
      readOnly: true,
    },
    {
      name: "quest_name",
      label: "Name",
      type: "text",
      unique: true,
    },
    {
      name: "quest_description",
      label: "Description",
      type: "text",
    },
    {
      name: "character_id",
      label: "Character",
      type: "select",
      foreignKey: true,
      optionsEndpoint: "Characters",
      selectTarget: "character_name",
      selectNone: true,
    },
  ];

  return <CRUDTable title="Quests" endpoint="Quests" fields={fields} />;
};

export default Quests;
