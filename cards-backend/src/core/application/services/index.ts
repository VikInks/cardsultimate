import * as fs from 'fs';

const exportModulesServices: () => any[] = () => {
    const files = fs.readdirSync(__dirname);
    return files.map(file => {
        return require(`./${file}`);
    });
};

export default exportModulesServices;