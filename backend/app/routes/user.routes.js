import express from "express";
import {
    findAll,
    findOne,
    create,
    update,
    deleteOne,
} from "../controllers/user.controller.js";
import { authJwt, user } from "../middlewares/index.js";

const router = express.Router();

router.get("/", [authJwt.verifyToken, authJwt.isAdmin], findAll);

router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], findOne);

router.post("/", [authJwt.verifyToken, authJwt.isAdmin, user.validateCreation], create);

router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin, user.validateUpdate], update);

router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteOne);

export default router;