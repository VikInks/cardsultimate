// import {Project, Type, InterfaceDeclaration, Node, JSDocTag} from 'ts-morph';
// import * as fs from 'fs';
// import * as path from 'path';
//
// function getTypeName(type: Type): string {
// 	if (type.isString()) return 'string';
// 	if (type.isBoolean()) return 'boolean';
// 	if (type.isNumber()) return 'number';
// 	if (type.getText() === 'Date') return 'string';
// 	if (type.isArray()) return getTypeName(type.getArrayElementTypeOrThrow()) + '[]';
// 	if (type.isObject()) return 'object';
// 	if (type.isUnion()) {
// 		return type
// 			.getUnionTypes()
// 			.map(getTypeName)
// 			.join(' | ');
// 	}
// 	return 'any';
// }
//
// function generateSchemaProperties(interfaceDeclaration: InterfaceDeclaration): any {
// 	const properties: any = {};
//
// 	for (const property of interfaceDeclaration.getProperties()) {
// 		const propertyName = property.getName();
// 		const propertyType = property.getType();
// 		const propertyDocs = property.getJsDocs()[0]?.getTags() || [];
//
// 		// Ignorer les propriétés avec @nodisplay
// 		if (propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'nodisplay')) {
// 			continue;
// 		}
//
// 		const typeDeclaration = propertyType.getSymbol()?.getDeclarations()?.[0];
//
// 		if (Node.isInterfaceDeclaration(typeDeclaration)) {
// 			properties[propertyName] = {
// 				type: 'object',
// 				properties: generateSchemaProperties(typeDeclaration),
// 			};
// 		} else if (propertyType.isObject()) {
// 			const subInterface = propertyType.getApparentType().getSymbol()?.getValueDeclaration();
// 			if (subInterface && Node.isInterfaceDeclaration(subInterface)) {
// 				properties[propertyName] = {
// 					type: 'object',
// 					properties: generateSchemaProperties(subInterface),
// 				};
// 			}
// 		} else if (propertyType.getText() === 'Date') {
// 			properties[propertyName] = { type: 'string', format: 'date-time' };
// 		} else {
// 			properties[propertyName] = { type: getTypeName(propertyType) };
// 		}
//
// 		// Ajouter des exemples à partir des balises JSDoc
// 		const exampleTag = propertyDocs.find((tag: JSDocTag) => tag.getTagName() === 'example');
// 		if (exampleTag) {
// 			properties[propertyName].example = exampleTag.getComment();
// 		}
// 	}
//
// 	return properties;
// }
//
// function generateJsonSchema(filePath: string) {
// 	const project = new Project();
// 	project.addSourceFileAtPath(filePath);
//
// 	const sourceFile = project.getSourceFileOrThrow(filePath);
//
// 	const interfaces = sourceFile.getInterfaces();
// 	const schemas: { [key: string]: any } = {};
//
// 	for (const interfaceDeclaration of interfaces) {
// 		const schema = {
// 			type: 'object',
// 			properties: generateSchemaProperties(interfaceDeclaration),
// 			required: [] as string[],
// 		};
//
// 		for (const property of interfaceDeclaration.getProperties()) {
// 			const propertyName = property.getName();
// 			const propertyDocs = property.getJsDocs()[0]?.getTags() || [];
//
// 			// Ignorer les propriétés avec @nodisplay
// 			if (propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'nodisplay')) {
// 				continue;
// 			}
//
// 			if (!property.hasQuestionToken() || propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'required')) {
// 				schema.required.push(propertyName);
// 			}
// 		}
//
// 		schemas[interfaceDeclaration.getName()] = schema;
// 	}
//
// 	return schemas;
// }
//
//
// function findFilesInDir(directory: string, extension: string): string[] {
// 	let result: string[] = [];
//
// 	fs.readdirSync(directory).forEach((file) => {
// 		const fullPath = path.join(directory, file);
// 		const fileStat = fs.lstatSync(fullPath);
//
// 		if (fileStat.isDirectory()) {
// 			result = result.concat(findFilesInDir(fullPath, extension));
// 		} else if (fileStat.isFile() && fullPath.endsWith(extension)) {
// 			result.push(fullPath);
// 		}
// 	});
//
// 	return result;
// }
//
// export async function generateSchemasJson() {
// 	const folderPath = './src/core/domain/endpoints';
// 	const fileExtension = '.ts';
//
// 	const filePaths = findFilesInDir(folderPath, fileExtension);
// 	const allSchemas: { [key: string]: any } = {};
//
// 	filePaths.forEach((filePath) => {
// 		const schemas = generateJsonSchema(filePath);
// 		Object.assign(allSchemas, schemas);
// 	});
//
// 	fs.writeFileSync('./src/core/doc/swagger/swagger.json', JSON.stringify(allSchemas, null, 2));
// }
