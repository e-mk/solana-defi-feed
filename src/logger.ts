import pino from "pino";
import { LOG_LEVEL } from "./constants.js";

export default pino.pino({level: LOG_LEVEL});