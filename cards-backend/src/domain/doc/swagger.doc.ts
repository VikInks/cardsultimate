import fs from 'fs';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

export const generateSwagger = () => {
	const options = {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'API Documentation',
				version: '1.0.0',
			},
		},
		apis: ['./src/**/*.ts'],
	};

	const swaggerSpec = swaggerJSDoc(options);

	const yaml = require('js-yaml');
	const swaggerYaml = yaml.dump(swaggerSpec);

	const dirPath = path.join(__dirname, 'swagger');
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}

	const filePath = path.join(dirPath, 'swagger.yaml');
	fs.writeFileSync(filePath, swaggerYaml, 'utf8');

	console.log('Swagger YAML generated at:', filePath);
	return filePath;
};

generateSwagger();
