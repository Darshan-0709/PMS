// Import routes
const authRoutes = require("./app/routes/auth.routes");
const recruiterRoutes = require("./app/routes/recruiter.routes");
const eligibilityCriteriaRoutes = require("./app/routes/eligibilityCriteria.routes");
const jobRequestRoutes = require("./app/routes/jobRequest.routes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/eligibility-criteria", eligibilityCriteriaRoutes);
app.use("/api/job-requests", jobRequestRoutes);
