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

	return swaggerJSDoc(options);
};
