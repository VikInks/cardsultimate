import { Project, InterfaceDeclaration, Type, Node, JSDocTag } from 'ts-morph';

export class SchemaGenerator {
    private project = new Project();

    constructor(private filePath: string) {
        this.project.addSourceFileAtPath(filePath);
    }

    generate(): { [key: string]: any } {
        const sourceFile = this.project.getSourceFileOrThrow(this.filePath);
        const interfaces = sourceFile.getInterfaces();
        const schemas: { [key: string]: any } = {};

        for (const interfaceDeclaration of interfaces) {
            schemas[interfaceDeclaration.getName()] = this.generateForInterface(interfaceDeclaration);
        }

        return schemas;
    }

    private generateForInterface(interfaceDeclaration: InterfaceDeclaration): any {
        const schema = {
            type: 'object',
            properties: this.generateSchemaProperties(interfaceDeclaration),
            required: [] as string[],
        };

        for (const property of interfaceDeclaration.getProperties()) {
            const propertyName = property.getName();
            const propertyDocs = property.getJsDocs()[0]?.getTags() || [];

            // Ignore properties with @nodisplay
            if (propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'nodisplay')) {
                continue;
            }

            if (!property.hasQuestionToken() || propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'required')) {
                schema.required.push(propertyName);
            }
        }

        return schema;
    }

    private generateSchemaProperties(interfaceDeclaration: InterfaceDeclaration): any {
        const properties: any = {};

        for (const property of interfaceDeclaration.getProperties()) {
            const propertyName = property.getName();
            const propertyType = property.getType();
            const propertyDocs = property.getJsDocs()[0]?.getTags() || [];

            // Ignore properties with @nodisplay
            if (propertyDocs.some((tag: JSDocTag) => tag.getTagName() === 'nodisplay')) {
                continue;
            }

            const typeDeclaration = propertyType.getSymbol()?.getDeclarations()?.[0];

            if (Node.isInterfaceDeclaration(typeDeclaration)) {
                properties[propertyName] = {
                    type: 'object',
                    properties: this.generateSchemaProperties(typeDeclaration),
                };
            } else if (propertyType.isObject()) {
                const subInterface = propertyType.getApparentType().getSymbol()?.getValueDeclaration();
                if (subInterface && Node.isInterfaceDeclaration(subInterface)) {
                    properties[propertyName] = {
                        type: 'object',
                        properties: this.generateSchemaProperties(subInterface),
                    };
                }
            } else if (propertyType.getText() === 'Date') {
                properties[propertyName] = { type: 'string', format: 'date-time' };
            } else {
                properties[propertyName] = { type: this.getTypeName(propertyType) };
            }

            // Add examples from JSDoc tags
            const exampleTag = propertyDocs.find((tag: JSDocTag) => tag.getTagName() === 'example');
            if (exampleTag) {
                properties[propertyName].example = exampleTag.getComment();
            }
        }

        return properties;
    }

    private getTypeName(type: Type): string {
        if (type.isString()) return 'string';
        if (type.isBoolean()) return 'boolean';
        if (type.isNumber()) return 'number';
        if (type.getText() === 'Date') return 'string';
        if (type.isArray()) return this.getTypeName(type.getArrayElementTypeOrThrow()) + '[]';
        if (type.isObject()) return 'object';
        if (type.isUnion()) {
            return type
                .getUnionTypes()
                .map(this.getTypeName)
                .join(' | ');
        }
        return 'any';
    }
}
