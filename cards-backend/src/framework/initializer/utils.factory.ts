import {DeckManagerUtility} from "../../config/utils/deck.manager.utility";

type UtilsClassMap = {
    DeckManagerUtility: DeckManagerUtility
};

type UtilsConstructorMap = {
    [K in keyof UtilsClassMap]: new (...args: any[]) => UtilsClassMap[K];
};

const utilsClasses: UtilsConstructorMap = {
    DeckManagerUtility
};

type UtilsInstanceMap<T> = {
    [K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

function createUtilsFactory<T extends Record<string, new (...args: any[]) => any>>(utilsClasses: T): UtilsInstanceMap<T> {
    const utilsFactory: Partial<UtilsInstanceMap<T>> = {};

    for (const key in utilsClasses) {
        utilsFactory[key as keyof T] = ((...args: any[]) => {
            const utilsClass = utilsClasses[key as keyof T];
            return new utilsClass(...args);
        }) as any;
    }

    return utilsFactory as UtilsInstanceMap<T>;
}

export const utilsFactory = createUtilsFactory(utilsClasses);
