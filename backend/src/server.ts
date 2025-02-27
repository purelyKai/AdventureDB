import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database";
import fs from "fs";
import path from "path";
import { Data } from "./types/types";

dotenv.config();

const app = express();
const PORT = process.env.VITE_PORT || 3524;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Express server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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

export default app;
