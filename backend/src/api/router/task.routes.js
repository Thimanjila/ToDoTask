const express = require("express");
const bodyParser = require("body-parser");

const controller = require("../../service/controller/taskController");

const router = express.Router();
router.use(bodyParser.json());

router.post("/", controller.create);
router.get("/", controller.read);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.put("/complete/:id", controller.complete);

module.exports = router;
