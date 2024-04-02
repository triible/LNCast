import { Router } from "express";
import refundMiddleware from "../middlewares/refundMiddleware.js";
import decodeInvoiceMiddleware from "../middlewares/decodeInvoiceMiddleware.js";
import { addLnAddress, addPreset, deleteLnAddress, getAllChats, getAllLnAddresses, getPresets, sendMessage } from "../controller.js";

const router = Router();

router.post("/send-message", refundMiddleware, decodeInvoiceMiddleware, sendMessage);
router.post("/add-lnaddress", addLnAddress);
router.post("/add-preset", addPreset);
router.get("/presets", getPresets);
router.delete("/", deleteLnAddress);
router.get("/", getAllLnAddresses);
router.get("/chats", getAllChats);

export default router;