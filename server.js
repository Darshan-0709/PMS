const express = require("express");
// const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.get("/", (req, res) => {
	res.send("Hello User!");
});

app.listen(3000);

const db = require("./app/models");
const Role = db.role;

// db.sequelize.sync({ force: true }).then(() => {
// 	console.log("Drop and Resync Db");
// 	initial();
// });
/* *******************************
 * initial() function helps us to create 3 rows in the database.
 * In development, you may need to delete existing tables and re-sync the database.
 * So you can use force: true like above code.
 *
 * For production, just enter this line manually and use sync() with no parameters to avoid data loss:
 * *******************************/
db.sequelize.sync();

function initial() {
	Role.create({
		id: 1,
		name: "user"
	});

	Role.create({
		id: 2,
		name: "moderator"
	});

	Role.create({
		id: 3,
		name: "admin"
	});
}
