import { Project, Type, InterfaceDeclaration, Node } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

function getTypeName(type: Type): string {
	if (type.isString()) return 'string';
	if (type.isBoolean()) return 'boolean';
	if (type.isNumber()) return 'number';
	if (type.getText() === 'Date') return 'string'; // Ajout pour gérer les dates
	if (type.isArray()) return getTypeName(type.getArrayElementTypeOrThrow()) + '[]';
	if (type.isObject()) return 'object';
	if (type.isUnion()) {
		return type
			.getUnionTypes()
			.map(getTypeName)
			.join(' | ');
	}
	return 'any';
}

function generateSchemaProperties(interfaceDeclaration: InterfaceDeclaration): any {
	const properties: any = {};

	for (const property of interfaceDeclaration.getProperties()) {
		const propertyName = property.getName();
		const propertyType = property.getType();

		if (propertyType.isObject()) {
			const subInterface = propertyType.getSymbol()?.getValueDeclaration();
			if (subInterface && Node.isInterfaceDeclaration(subInterface)) {
				properties[propertyName] = {
					type: 'object',
					properties: generateSchemaProperties(subInterface),
				};
			}
		} else if (propertyType.getText() === 'Date') { // Ajout pour gérer les dates
			properties[propertyName] = { type: 'string', format: 'date-time' };
		} else {
			properties[propertyName] = { type: getTypeName(propertyType) };
		}
	}

	return properties;
}

function generateJsonSchema(filePath: string) {
	const project = new Project();
	project.addSourceFileAtPath(filePath);

	const sourceFile = project.getSourceFileOrThrow(filePath);

	const interfaces = sourceFile.getInterfaces();
	const schemas: { [key: string]: any } = {};

	for (const interfaceDeclaration of interfaces) {
		const schema = {
			type: 'object',
			properties: generateSchemaProperties(interfaceDeclaration),
			required: [] as string[],
		};

		for (const property of interfaceDeclaration.getProperties()) {
			const propertyName = property.getName();

			if (!property.hasQuestionToken()) {
				schema.required.push(propertyName);
			}
		}

		schemas[interfaceDeclaration.getName()] = schema;
	}

	return schemas;
}

function findFilesInDir(directory: string, extension: string): string[] {
	let result: string[] = [];

	fs.readdirSync(directory).forEach((file) => {
		const fullPath = path.join(directory, file);
		const fileStat = fs.lstatSync(fullPath);

		if (fileStat.isDirectory()) {
			result = result.concat(findFilesInDir(fullPath, extension));
		} else if (fileStat.isFile() && fullPath.endsWith(extension)) {
			result.push(fullPath);
		}
	});

	return result;
}

export async function generateSchemasJson() {
	const folderPath = './src/domain/interfaces/endpoints';
	const fileExtension = '.ts';

	const filePaths = findFilesInDir(folderPath, fileExtension);
	const allSchemas: { [key: string]: any } = {};

	filePaths.forEach((filePath) => {
		const schemas = generateJsonSchema(filePath);
		Object.assign(allSchemas, schemas);
	});

	fs.writeFileSync('./src/domain/doc/swagger/swagger.json', JSON.stringify(allSchemas, null, 2));
}
