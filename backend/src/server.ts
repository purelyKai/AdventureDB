import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database/databaseConnector";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "8379";

// List of allowed tables/endpoints - this serves as a whitelist
// for security and prevents accessing unauthorized database tables
const ALLOWED_TABLES = [
  `Classes`,
  `Chests`,
  `Characters`,
  `Quests`,
  `Items`,
  `Character_has_Items`,
  `Chest_has_Items`,
];

/**
 * Middleware: Validates table names from request parameters
 * Ensures we only allow access to predefined tables to prevent SQL injection
 * and unauthorized access to other database tables
 */
const validateTableName = (req: Request, res: Response, next: NextFunction) => {
  const { endpoint } = req.params;

  if (!ALLOWED_TABLES.includes(endpoint)) {
    return res.status(404).json({ message: "Resource not found" });
  }

  next();
};

// Enable CORS for all routes and parse JSON request bodies
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Express server is running");
});

/**
 * GET Route: Fetch all records from a specific table
 * Orders results by the table's primary key for consistent pagination
 */
app.get(
  "/api/:endpoint/:forDropdown",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint, forDropdown } = req.params;
      console.log("Fetching from table:", endpoint);

      const columnToOrderBy =
        forDropdown == "true"
          ? getIdentifyingColumn(endpoint)
          : getPrimaryKeyColumn(endpoint);
      const query = `SELECT * FROM ?? ORDER BY ??`;

      const [results] = await db.query(query, [endpoint, columnToOrderBy]);
      res.json(results);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "Error fetching data" });
    }
  }
);

/**
 * POST Route: Create a new record in a specified table
 * Dynamically builds the INSERT query based on the request body fields
 * This allows flexible insertion without hardcoding column names
 */
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

      // Dynamically create the INSERT statement based on request body
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

/**
 * PUT Route: Update an existing record by ID
 * Dynamically creates a parameterized UPDATE query to prevent SQL injection
 * Handles partial updates by only modifying specified fields
 */
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

      const primaryKeyColumn = getPrimaryKeyColumn(endpoint);
      const columns = Object.keys(updatedRecord);
      const values = Object.values(updatedRecord);

      // Create the SET clause for the UPDATE statement with placeholders
      const setClause = columns.map(() => "?? = ?").join(", ");
      const query = `UPDATE ?? SET ${setClause} WHERE ?? = ?`;

      // Build params array with properly escaped values
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

/**
 * DELETE Route: Remove a record by ID
 * Uses parameterized queries to prevent SQL injection
 */
app.delete(
  "/api/:endpoint/:id",
  validateTableName,
  async (req: Request, res: Response) => {
    try {
      const { endpoint, id } = req.params;

      const primaryKeyColumn = getPrimaryKeyColumn(endpoint);

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

/**
 * Utility Function: Determines the primary key column name for a given table
 *
 * Logic:
 * - For junction tables (containing '_'): use the table name + '_id'
 * - For tables ending with 'es': remove 'es' and add '_id'
 * - For other tables: remove the last character (assuming 's') and add '_id'
 *
 * This follows a naming convention where primary keys are singular_table_name_id
 */
function getPrimaryKeyColumn(endpoint: string) {
  var primaryKeyColumn = "";
  var endpointLower = endpoint.toLowerCase();

  // If endpoint is an intersection table, key column is the name of the table
  if (endpoint.includes("_")) {
    primaryKeyColumn = endpointLower;
  } else {
    primaryKeyColumn = removePlural(endpoint);
  }

  return primaryKeyColumn + "_id";
}

// Gets the identifying column for the given endpoint
function getIdentifyingColumn(endpoint: string) {
  const columnPrefix = removePlural(endpoint.toLocaleLowerCase());

  if (endpoint == "Chests") {
    return columnPrefix + "_id";
  } else {
    return columnPrefix + "_name";
  }
}

// Removes plural ending on the given plural word
function removePlural(word: string) {
  if (word.endsWith("es")) {
    return word.slice(0, -2);
  } else {
    return word.slice(0, -1);
  }
}

// Global error handler for uncaught exceptions
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
