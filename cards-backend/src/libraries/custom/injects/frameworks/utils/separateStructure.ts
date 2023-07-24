import {structureClass} from "../../domains/types/types.injects";

// TODO: Use custom decorator and get rid of this function
export const separateParameters = (parameters: structureClass[]) => {
    const repositories: structureClass[] = [];
    const services: structureClass[] = [];
    const controllers: structureClass[] = [];
    const adapters: structureClass[] = [];
    parameters.forEach((param) => {
        if (param.name.includes('Repository')) {
            repositories.push(param);
        } else if (param.name.includes('Service')) {
            services.push(param);
        } else if (param.name.includes('Controller')) {
            controllers.push(param);
        } else if (param.name.includes('Adapter')) {
            adapters.push(param);
        }
    });
    return {repositories, services, controllers, adapters};
}