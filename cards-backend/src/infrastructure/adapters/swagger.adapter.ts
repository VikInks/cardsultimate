import { OptionsInterface } from "../../domain/interfaces/options.interface";
import * as path from "path";
import * as fs from "fs";
import swaggerAutogen from "swagger-autogen";

async function generateSwaggerJson(options: OptionsInterface) {
  const doc = {...options};
  const controllersPath = path.join(__dirname, "../controllers");
  const controllersFiles = fs.readdirSync(controllersPath).filter((file) => file.endsWith(".ts"));
  const endpointsFiles = controllersFiles.map((file) => path.join(controllersPath, file));
  return await swaggerAutogen()(options, endpointsFiles, doc);
}