import {Document} from "bson";
import DbAdapter from "../../../../core/infrastructure/adapters/db.adapter";
import {InitDatabase} from "../../../../core/framework/initializer/initDatabase";
import {MongoAdapterInput} from "../domains/types/types.injects";
import {getModules} from "../frameworks/decorators/types.decorators";
import {Component} from "../domains/interfaces/structure";

const dirname = `../../../..`

const initRepositories = async (repositories: Component[]): Promise<DbAdapter<Document>[]> => {
    const db = await InitDatabase();

    function createTypedMongoAdapter<T extends Document>(input: MongoAdapterInput): DbAdapter<T> {
        return new DbAdapter<T>(input);
    }

    const typeMongoAdapters = repositories.map(async (entity) => {
        return createTypedMongoAdapter({
            entityName: (entity.className).replace('Repository', '').toLowerCase(),
            collection: await db.getCollection((entity.className).replace('Repository', '').toLowerCase())
        });
    });

    const mongoAdapters = await Promise.all(typeMongoAdapters);
    return mongoAdapters.map((adapter, index) => {
        const param = repositories[index];
        const repository = require(`${dirname}/core/infrastructure/repositories/${(param.className).replace('Repository', '').toLowerCase()}.repository.ts`).default;
        return new repository(adapter, ...param.dependencies);
    });
}

const initAdapters = async (adapters: Component[]): Promise<any[]> => {
    adapters = adapters.filter((adapter) => adapter.className !== 'DbAdapter' && adapter.className !== 'MongoDatabaseConnection');
    const adaptersInitialized: any[] = [];
    let adaptersWaiting: Component[] = adapters.slice();

    // Initialize adapters with no parameters
    adaptersWaiting = adaptersWaiting.filter((adapter) => {
        if (adapter.dependencies.length === 0) {
            const adapterModule = require(`${dirname}/core/infrastructure/adapters/${adapter.className.replace('Adapter', '').toLowerCase()}.adapter.ts`).default ?? null;
            console.log(`Initializing adapter: ${adapter.className.replace('Adapter', '').toLowerCase()}`)
            adapterModule ? adaptersInitialized.push(new adapterModule()) : null;
            return false;
        }
        return true;
    });

    let tryCount = 0;
    while (adaptersWaiting.length > 0) {
        let adapter = adaptersWaiting[0];
        adaptersWaiting = adaptersWaiting.slice(1);
        tryCount++;
        if (tryCount > adaptersWaiting.length + 3) {
            console.log(`Failed to initialize adapters: ${adaptersWaiting.map((adapter) => adapter.className)} after ${tryCount} tries`);
            break;
        }

        const adapterModule = require(`${dirname}/core/infrastructure/adapters/${adapter.className.replace('Adapter', '').toLowerCase()}.adapter.ts`).default ?? null;
        if (adapterModule) {
            const adapterParameters = adapter.dependencies.map((dependency) => {
                console.log(`dependency: ${dependency}`);
                let dependencyClassName = dependency.split(' ')[2].toLowerCase();
                dependencyClassName = dependencyClassName.replace(':', 'adapter');
                return adaptersInitialized.find((adapter) => adapter.constructor.name.replace('interface', '').toLowerCase().includes(dependencyClassName));
            });

            if (!adapterParameters.includes(undefined)) {
                try {
                    adaptersInitialized.push(new adapterModule(...adapterParameters));
                } catch (e) {
                    console.log('Failed to initialize adapter: ', adapter, e);
                }
            } else {
                adaptersWaiting.push(adapter);
            }
        }
    }

    return adaptersInitialized;
};

// const initServices = async (services: Component[], repositories: DbAdapter<Document>[], adapters: any[]) => {
//     type ServiceParam = {
//         name: string;
//         parameters: string[];
//         implementation: string;
//     };
//     type AdjacencyService = ServiceParam & {
//         adj: string[];
//     };
//     const paramEntity = getStructure(services);
//
//     const serviceMap = new Map<string, AdjacencyService>();
//
//     for (let service of paramEntity) {
//         serviceMap.set(service.name, {
//             ...service,
//             adj: []
//         });
//     }
//
//     for (let service of paramEntity) {
//         const {parameters} = service;
//         const deps = parameters.map(p => p.split(' ')[2].split(':')[0]);
//
//         for (let dep of deps) {
//             if (serviceMap.has(dep)) {
//                 serviceMap.get(dep)!.adj.push(service.name);
//             }
//         }
//     }
//
//     const visited = new Set<string>();
//     const stack: string[] = [];
//
//     for (let service of paramEntity) {
//         if (!visited.has(service.name)) {
//             dfs(service.name);
//         }
//     }
//
//     function dfs(node: string) {
//         visited.add(node);
//
//         const {adj} = serviceMap.get(node)!;
//
//         for (let neighbor of adj) {
//             if (!visited.has(neighbor)) {
//                 dfs(neighbor);
//             }
//         }
//
//         stack.push(node);
//     }
//
//     const initOrder = stack.reverse();
//
//     const orderedServices = initOrder.map(
//         name => serviceMap.get(name)!
//     );
//
//     console.log(orderedServices);
//
// }

export async function initialize() {
    const {Controller, Adapter, Service, Repository} = getModules();
    const Repositories = await initRepositories(Repository); // done
    const Adapters = await initAdapters(Adapter); // done
    // const Services = await initServices(Service, Repositories, Adapters); // TODO
}
