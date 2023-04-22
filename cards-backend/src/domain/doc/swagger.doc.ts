import swaggerJSDoc from 'swagger-jsdoc';
import { generateSchemasJson } from './generate.schemas.doc';
import * as fs from 'fs';
import * as path from 'path';

export const  generateSwagger = async () => {
	await generateSchemasJson();

	const swaggerJsonPath = path.join(__dirname, 'swagger', 'swagger.json');

	if (!fs.existsSync(swaggerJsonPath)) {
		console.error(`Le fichier ${swaggerJsonPath} n'existe pas. Assurez-vous de l'avoir généré en appelant d'abord generateSchemasJson().`);
		process.exit(1);
	}

	const swaggerJson = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));

	const options = {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'API Documentation',
				version: '1.0.0',
			},
			components: {
				schemas: swaggerJson,
				securitySchemes: {
					BearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
					},
				},
			},
			security: [
				{
					BearerAuth: [],
				},
			],
		},
		apis: ['./src/**/*.ts'],
	};


	return swaggerJSDoc(options);
};
