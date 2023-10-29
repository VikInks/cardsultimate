import * as fs from 'fs';
import * as path from 'path';

export class FilesFinder {
    constructor(private directory: string, private extension: string) {}

    find(): string[] {
        return this.findInDir(this.directory);
    }

    private findInDir(directory: string): string[] {
        let result: string[] = [];

        const outputDirectory = path.resolve(__dirname, '../../../src/core/doc/swagger');
        if (!fs.existsSync(outputDirectory)){
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.join(directory, file);
            const fileStat = fs.lstatSync(fullPath);

            if (fileStat.isDirectory()) {
                result = result.concat(this.findInDir(fullPath));
            } else if (fileStat.isFile() && fullPath.endsWith(this.extension)) {
                result.push(fullPath);
            }
        });

        return result;
    }
}
