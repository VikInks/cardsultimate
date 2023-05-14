// @ts-ignore
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/controllers/*.ts'];

const doc = {
	info: {
		title: "Nom de votre API",
		description: "Description de votre API"
	},
	host: "localhost:3000",
	schemes: ['http', 'https']
};

swaggerAutogen()(outputFile, endpointsFiles, doc);