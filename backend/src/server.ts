import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database/databaseConnector";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "8379";

// List of allowed tables/endpoints
const ALLOWED_TABLES = [
  `Classes`,
  `Chests`,
  `Characters`,
  `Quests`,
  `Items`,
  `Character_has_Items`,
  `Chest_has_Items`,
];

// Middleware for validating table names
const validateTableName = (req: Request, res: Response, next: NextFunction) => {
  const { endpoint } = req.params;

  if (!ALLOWED_TABLES.includes(endpoint)) {
    return res.status(404).json({ message: "Resource not found" });
  }

  next();
};

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Express server is running");
});

// Fetch all records from a table
app.get(
  "/api/:endpoint",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint } = req.params;
      console.log("Fetching from table:", endpoint);

      const query = `SELECT * FROM ??`;

      const [results] = await db.query(query, [endpoint]);
      res.json(results);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "Error fetching data" });
    }
  }
);

// Insert a new record
app.post(
  "/api/:endpoint",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint } = req.params;
      const newRecord = req.body;

      if (!newRecord || Object.keys(newRecord).length === 0) {
        return res
          .status(400)
          .json({ message: "Request body cannot be empty" });
      }

      const columns = Object.keys(newRecord);
      const values = Object.values(newRecord);
      const placeholders = columns.map(() => "?").join(", ");

      const query = `INSERT INTO ?? (${columns
        .map(() => "??")
        .join(", ")}) VALUES (${placeholders})`;
      const params = [endpoint, ...columns, ...values];

      const [result]: any = await db.query(query, params);
      res.status(201).json({ id: result.insertId, ...newRecord });
    } catch (err) {
      console.error("Database insert error:", err);
      res.status(400).json({ message: "Error creating record" });
    }
  }
);

// Update a record by ID
app.put(
  "/api/:endpoint/:id",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint, id } = req.params;
      const updatedRecord = req.body;

      if (!updatedRecord || Object.keys(updatedRecord).length === 0) {
        return res
          .status(400)
          .json({ message: "Request body cannot be empty" });
      }

      const primaryKeyColumn = `${
        endpoint.toLowerCase().endsWith("es")
          ? endpoint.slice(0, -2)
          : endpoint.slice(0, -1)
      }_id`;

      const columns = Object.keys(updatedRecord);
      const values = Object.values(updatedRecord);

      const setClause = columns.map(() => "?? = ?").join(", ");
      const query = `UPDATE ?? SET ${setClause} WHERE ?? = ?`;

      const params: any[] = [endpoint];
      columns.forEach((col, i) => {
        params.push(col, values[i]);
      });
      params.push(primaryKeyColumn, id);

      const [result]: any = await db.query(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record updated successfully" });
    } catch (err) {
      console.error("Database update error:", err);
      res.status(400).json({ message: "Error updating record" });
    }
  }
);

// Delete a record by ID
app.delete(
  "/api/:endpoint/:id",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint, id } = req.params;

      const primaryKeyColumn = `${
        endpoint.toLowerCase().endsWith("es")
          ? endpoint.slice(0, -2)
          : endpoint.slice(0, -1)
      }_id`;

      const params: any[] = [endpoint, primaryKeyColumn, id];

      const query = `DELETE FROM ?? WHERE ?? = ?`;

      const [result]: any = await db.query(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record deleted successfully" });
    } catch (err) {
      console.error("Database delete error:", err);
      res.status(400).json({ message: "Error deleting record" });
    }
  }
);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://classwork.engr.oregonstate.edu:${PORT}`
  );
});

export default app;
