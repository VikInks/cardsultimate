import * as dotenv from "dotenv";
import {initialize} from "./libraries/custom/injects/application/initializer";
import exportModulesControllers from "./core/application/controllers/index";
import exportModulesServices from "./core/application/services/index";
import exportModulesMiddlewares from "./core/framework/middleware";
import exportModulesAdapters from "./core/infrastructure/adapters/index";
import exportModulesRepositories from "./core/infrastructure/repositories";

exportModulesControllers();
exportModulesServices();
exportModulesMiddlewares();
exportModulesAdapters();
exportModulesRepositories();

dotenv.config({path: __dirname + '/.env'});

initialize().then(r => console.log('Application initialized')).catch(e => console.log(e));
