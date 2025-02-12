import { Router } from "express";
import { IdentifyController } from "../controllers/identifyController";

const router = Router();
const identifyController = new IdentifyController();

router.post("/identify", identifyController.identify);

export default router;
