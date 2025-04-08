require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const db = require("./models");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const placementCellRoutes = require("./routes/placementCell.routes");
const recruiterRoutes = require("./routes/recruiter.routes");
const eligibilityCriteriaRoutes = require("./routes/eligibilityCriteria.routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection with Force Sync
const connectDB = async () => {
	try {
		await db.sequelize.authenticate();
		console.log("Database connection established");

		// FORCE CREATE TABLES (Drops existing tables)
		// await db.sequelize.sync({ force: true });
		await db.sequelize.sync({ alter: true }); // Use alter to update the tables without dropping them
		console.log("All tables created successfully!");
	} catch (error) {
		console.error("Database error:", error);
		process.exit(1);
	}
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/placement-cell", placementCellRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/eligibility-criteria", eligibilityCriteriaRoutes);

// Test Route to Verify Tables
app.get("/api/check-tables", async (req, res) => {
	try {
		const tables = await db.sequelize.query(
			"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
		);
		res.json({ tables: tables[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/", (req, res) => {
	res.send("Welcome to the Placement Management System API!");
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = config.port || 3000;
app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server running on port ${PORT}`);
	console.log("Database tables recreated on startup");
});
