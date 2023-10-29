import * as fs from 'fs';
import {FilesFinder} from "./file.finder.doc";
import {SchemaGenerator} from "./schema.generator.doc";


export async function generateSchemasJson() {
	const folderPath = './src/domain/';
	const fileExtension = '.ts';

	const filesFinder = new FilesFinder(folderPath, fileExtension);
	const filePaths = filesFinder.find();
	const allSchemas: { [key: string]: any } = {};

	filePaths.forEach((filePath) => {
		const generator = new SchemaGenerator(filePath);
		const schemas = generator.generate();
		Object.assign(allSchemas, schemas);
	});

	fs.writeFileSync('./src/config/doc/swagger/swagger.json', JSON.stringify(allSchemas, null, 2));
}
