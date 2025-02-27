import CRUDTable from "../components/CRUDTable";

const Chests = () => {
  const fields = [
    {
      name: "chest_id",
      label: "ID",
      type: "number",
      readOnly: true,
    },
    {
      name: "chest_x_coordinate",
      label: "X Coordinate",
      type: "number",
    },
    {
      name: "chest_y_coordinate",
      label: "Y Coordinate",
      type: "number",
    },
  ];

  return <CRUDTable title="Chests" endpoint="Chests" fields={fields} />;
};

export default Chests;
