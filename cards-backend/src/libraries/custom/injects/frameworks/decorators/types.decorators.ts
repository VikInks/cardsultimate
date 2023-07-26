import {Structure} from "../../domains/interfaces/structure";
import "reflect-metadata";

const Modules: Structure = {
    Controller: [],
    Service: [],
    Repository: [],
    Adapter: []
};

export const Controller = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.Controller.push({
            className: target.name,
            dependencies: dependencyNames
        });
    };
};

export const Service = (order = 0): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.Service.push({
            className: target.name,
            dependencies: dependencyNames,
            order
        });
    };
};

export const Repository = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        Modules.Repository.push({
            className: target.name,
            dependencies: dependencyNames
        });
    };
};

export const Adapter = (): ClassDecorator => {
    return (target: Function) => {
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencyNames = dependencies.map((dependency: Function) => dependency.name);
        console.log(`Adapter ${target.name} dependencies: ${dependencyNames}`);
        Modules.Adapter.push({className: target.name, dependencies: dependencyNames});
    };
};

export const getModules = () => {
    Modules.Service.sort((a, b) => {
        if (a.order && b.order) {
            return a.order - b.order;
        }
        return -1;
    });
    return Modules;
};