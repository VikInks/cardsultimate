import {structureClass} from "../../domains/types/types.injects";

export const getStructure = (map: structureClass[]): structureClass[] => {
    let first = map[0].name;
    let type = '';

    for (let i = first.length; i >= 0; i--) {
        let pattern = first.substring(i);
        if (map.every(item =>
            item.name.endsWith(pattern) &&
            (item.name.length === pattern.length || !/[a-z]/.test(item.name[item.name.length - pattern.length]))
        )) {
            type = pattern;
            if (first[i - 1] === undefined || first[i - 1].toUpperCase() === first[i - 1]) {
                break;
            }
        }
    }

    return map.map((structure) => {
        const name = structure.name.replace(type, '').toLowerCase();
        return {...structure, name: name};
    });
}