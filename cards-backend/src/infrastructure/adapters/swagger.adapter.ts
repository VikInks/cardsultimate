import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import {SwaggerInterface} from "../../domain/interfaces/swagger.interface";
import {INextFunction, IRequest, IResponse} from "../../domain/interfaces/requestHandler.interface";

export class SwaggerAdapter implements SwaggerInterface {
  private readonly swaggerSpec: any;

  constructor() {
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

    this.swaggerSpec = swaggerJsdoc(options);
  }

  public setupSwagger(app: any): void {
    app.use(
        '/api-docs',
        (req: IRequest, res: IResponse, next: INextFunction) => {
          if (req.user && req.user.role === 'SuperUser') {
            next();
          } else {
            res.status(403).json({ message: 'Forbidden: Only SuperUser can access the API documentation' });
          }
        },
        swaggerUi.serve,
        swaggerUi.setup(this.swaggerSpec)
    );
  }
}
