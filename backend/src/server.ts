import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import db from "./database";
import fs from "fs";
import path from "path";
import { Data } from "./types/types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Express server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
// Fetch all records from a table
app.get("/api/:endpoint", async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.params;
    console.log("Fetching from table:", endpoint);
    const [results] = await db.query(`SELECT * FROM ??`, [endpoint]);
    res.json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

// Insert a new record
app.post("/api/:endpoint", async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.params;
    const newRecord = req.body;

    const columns = Object.keys(newRecord);
    const values = Object.values(newRecord);
    const placeholders = columns.map(() => "?").join(", ");
    const query = `INSERT INTO ?? (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    const [result]: any = await db.query(query, [endpoint, ...values]);
    res.json({ id: result.insertId, ...newRecord });
  } catch (err) {
    res.status(500).json({ message: "Error creating record", error: err });
  }
});

// Update a record by ID
app.put("/api/:endpoint/:id", async (req: Request, res: Response) => {
  try {
    const { endpoint, id } = req.params;
    const updatedRecord = req.body;

    const updateFields = Object.keys(updatedRecord)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updatedRecord);

    const query = `UPDATE ?? SET ${updateFields} WHERE id = ?`;
    await db.query(query, [endpoint, ...values, id]);

    res.json({ message: "Record updated", updatedRecord });
  } catch (err) {
    res.status(500).json({ message: "Error updating record", error: err });
  }
});

// Delete a record by ID
app.delete("/api/:endpoint/:id", async (req: Request, res: Response) => {
  try {
    const { endpoint, id } = req.params;

    const query = `DELETE FROM ?? WHERE id = ?`;
    await db.query(query, [endpoint, id]);

    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err });
  }
});
*/

// Path to mock data file
const dataFilePath = path.join(__dirname, "data.json");

// Helper function to read data from the file
const readData = (): Data => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return {
      Classes: [],
      Chests: [],
      Characters: [],
      Quests: [],
      Items: [],
      Character_has_Items: [],
      Chest_has_Items: [],
    };
  }
};

// Helper function to write data to the file
const writeData = (data: Data): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

// Fetch all records from a table
app.get("/api/:endpoint", async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.params as { endpoint: keyof Data };
    const data = readData();
    console.log("Fetching from table:", endpoint);

    // Simulate database query with mock data
    const results = data[endpoint] || [];

    res.json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

// Insert a new record
app.post("/api/:endpoint", async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.params as { endpoint: keyof Data };
    const newRecord = req.body;

    let data = readData();

    const newId = (data[endpoint] && data[endpoint].length + 1) || 1;
    const newData = {
      ...newRecord,
      [`${endpoint.slice(0, -1).toLowerCase()}_id`]: newId,
    }; // Use table name suffix (e.g., `class_id`, `chest_id`)
    data[endpoint] = [...(data[endpoint] || []), newData]; // Add new record to the correct table

    writeData(data); // Write updated data to file

    res.json(newData); // Return the added record
  } catch (err) {
    res.status(500).json({ message: "Error creating record", error: err });
  }
});

/*
// Helper function to narrow the type based on the endpoint
const getTableForEndpoint = <T extends keyof Data>(
  data: Data,
  endpoint: T
): Data[T] => {
  return data[endpoint]; // Return the correct type of array based on endpoint
};

// Update a record by ID
app.put("/api/:endpoint/:id", async (req: Request, res: Response) => {
  try {
    const { endpoint, id } = req.params as { endpoint: keyof Data; id: string };
    const updatedRecord = req.body;

    let data = readData();
    const table = getTableForEndpoint(data, endpoint);

    // Find the record by its ID
    const index = table.findIndex(
      (item: any) => item[`${endpoint.slice(0, -1)}_id`] == id
    );

    // Update the record and write the data back
    table[index] = { ...table[index], ...updatedRecord };
    data[endpoint] = table;
    writeData(data);

    res.json({ message: "Record updated", updatedRecord });
  } catch (err) {
    res.status(500).json({ message: "Error updating record", error: err });
  }
});

// Delete a record by ID
app.delete("/api/:endpoint/:id", async (req: Request, res: Response) => {
  try {
    const { endpoint, id } = req.params as { endpoint: keyof Data; id: string };

    let data = readData();
    const table = getTableForEndpoint(data, endpoint);

    // Find and remove the record
    const index = table.findIndex(
      (item: any) => item[`${endpoint.slice(0, -1)}_id`] == id
    );

    table.splice(index, 1); // Remove the record
    data[endpoint] = table;
    writeData(data);

    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err });
  }
});
*/

export default app;
