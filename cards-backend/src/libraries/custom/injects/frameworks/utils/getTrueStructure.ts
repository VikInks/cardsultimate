import {structureClass} from "../../domains/types/types.injects";
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export const getTrueStructure = async (directories: string[]): Promise<structureClass[]> => {
    const classNameParam: structureClass[] = []
    const getTsFiles = async (dirPath: string, arrayOfFiles: string[] = []) => {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
                arrayOfFiles = await getTsFiles(`${dirPath}/${file}`, arrayOfFiles);
            } else if (path.extname(file) === '.ts') {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }

        return arrayOfFiles;
    };

    let allTsFiles: string[] = [];
    for (const dir of directories) {
        allTsFiles = [...allTsFiles, ...await getTsFiles(dir)];
    }
    let count = 0;
    allTsFiles.forEach((filePath) => {
        count++;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const sourceFile = ts.createSourceFile(
            filePath,
            fileContent,
            ts.ScriptTarget.Latest,
            /*setParentNodes*/ true
        );

        const visit = (node: ts.Node) => {
            if (ts.isClassDeclaration(node)) {
                const className = node.name?.getText(sourceFile);
                const classImplements = node.heritageClauses?.map((clause) => clause.types.map((type) => type.expression.getText(sourceFile))) ?? '';
                let hasConstructor = false;

                for (const member of node.members) {
                    if (ts.isConstructorDeclaration(member)) {
                        hasConstructor = true;
                        const constructorParameters = member.parameters.map((parameter) => parameter.getText(sourceFile));
                        if (className) {
                            classNameParam.push({
                                name: className,
                                parameters: constructorParameters,
                                implementation: classImplements.toString()
                            });
                        }
                    }
                }

                if (!hasConstructor && className) {
                    classNameParam.push({
                        name: className,
                        parameters: [],
                        implementation: classImplements.toString()
                    });
                }
            }

            ts.forEachChild(node, visit);
        };
        ts.forEachChild(sourceFile, visit);
    });
    return classNameParam;
}