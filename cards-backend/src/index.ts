import * as dotenv from "dotenv";
import {initialize} from "./libraries/custom/injects/application/initializer";

dotenv.config({path: __dirname + '/.env'});

initialize()
