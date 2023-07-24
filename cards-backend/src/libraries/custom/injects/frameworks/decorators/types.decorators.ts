import {Structure} from "../../domains/interfaces/structure";
import "reflect-metadata";

const Modules : Structure[] = [];

export const Controller = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.push({
            Controller: [{ className: target.name, dependencies: dependencyNames}],
            Service: [],
            Repository: [],
            Adapter: []
        });
    };
};

export const Service = (order = 0): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.push({
            Controller: [],
            Service: [{ className: target.name, dependencies: dependencyNames, order }],
            Repository: [],
            Adapter: []
        });
    };
};

export const Repository = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.push({
            Controller: [],
            Service: [],
            Repository: [{ className: target.name, dependencies: dependencyNames }],
            Adapter: []
        });
    };
}

export const Adapter = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.push({
            Controller: [],
            Service: [],
            Repository: [],
            Adapter: [{ className: target.name, dependencies: dependencyNames }]
        });
    };
}

export const getModules = () => {
    return Modules;
}