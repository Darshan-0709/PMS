const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const placementCellRoutes = require("./app/routes/placementCell.routes");
const studentRoutes = require("./app/routes/student.routes");

// Use the routes with a prefix
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/placement_cell", placementCellRoutes);
app.use("/api/student", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello User!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Sync the database (force: true will drop and recreate tables)
// db.sequelize.sync({ alter: true }).then(() => {
//   console.log("Database synchronized and tables dropped/recreated.");
// });
// await sequelize.sync({ force: true }).then(async () => {
//   // await db.User.sync();          // Ensure Users table exists first
//   // await db.PlacementCell.sync(); // Ensure PlacementCell exists
//   // await db.Student.sync();       // Now Students can be created safely
// });
/* *******************************
 * initial() function helps us to create 3 rows in the database.
 * In development, you may need to delete existing tables and re-sync the database.
 * So you can use force: true like above code.
 *
 * For production, just enter this line manually and use sync() with no parameters to avoid data loss:
 * *******************************/
db.sequelize.sync();
