import * as fs from 'fs';

const exportModulesControllers: () => any[] = () => {
    const files = fs.readdirSync(__dirname);
    return files.map(file => {
        return require(`./${file}`);
    });
};

export default exportModulesControllers;