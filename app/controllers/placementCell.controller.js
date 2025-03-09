const db = require("../models");
const placementCell = db.placementCell;
exports.setProfile = async (req, res) => {
  console.log(req.params.id);
  try {
    const [updatedRows] = await placementCell.update(
      {
        domains: req.body.domain,
        branches: req.body.branches,
      },
      {
        where: { placementCellId: req.params.id },
      }
    );
    if (updatedRows === 0) {
      return res
        .status(404)
        .send({ message: "Placement not found or no changes made" });
    }
    res.send({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
