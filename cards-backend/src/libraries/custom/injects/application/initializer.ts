import {Document} from "bson";
import DbAdapter from "../../../../core/infrastructure/adapters/db.adapter";
import {InitDatabase} from "../../../../core/framework/initializer/initDatabase";
import {MongoAdapterInput, structureClass} from "../domains/types/types.injects";
import {getStructure} from "../frameworks/utils/structure.parametre";
import {getTrueStructure} from "../frameworks/utils/getTrueStructure";
import {separateParameters} from "../frameworks/utils/separateStructure";
import {Structure} from "../domains/interfaces/structure";
import {getModules} from "../frameworks/decorators/types.decorators";

const initRepositories = async (repositories: structureClass[]): Promise<DbAdapter<Document>[]> => {
    const db = await InitDatabase();

    function createTypedMongoAdapter<T extends Document>(input: MongoAdapterInput): DbAdapter<T> {
        return new DbAdapter<T>(input);
    }

    const paramEntity = getStructure(repositories)

    const typeMongoAdapters = paramEntity.map(async (entity) => {
        return createTypedMongoAdapter({
            entityName: entity.name,
            collection: await db.getCollection(entity.name)
        });
    });

    const mongoAdapters = await Promise.all(typeMongoAdapters);
    return mongoAdapters.map((adapter, index) => {
        const param = paramEntity[index];
        const repository = require(`${__dirname}/core/infrastructure/repositories/${param.name}.repository.ts`).default;
        return new repository(adapter, ...param.parameters);
    });
}

const initAdapters = async (adapters: structureClass[]): Promise<any[]> => {
    const paramEntity = getStructure(adapters).filter((adapter) => adapter.name !== 'db');

    const adaptersInitialized: any[] = [];
    let adaptersWaiting: structureClass[] = paramEntity.slice();

    // Initialize adapters with no parameters
    adaptersWaiting = adaptersWaiting.filter((adapter) => {
        if (adapter.parameters.length === 0) {
            const adapterModule = require(`${__dirname}/core/infrastructure/adapters/${adapter.name}.adapter.ts`).default ?? null;
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
            console.log(`Failed to initialize adapters: ${adaptersWaiting.map((adapter) => adapter.name)} after ${tryCount} tries`);
            break;
        }
        try {
            const adapterModule = require(`${__dirname}/core/infrastructure/adapters/${adapter.name}.adapter.ts`).default ?? null;
            if (adapterModule) {
                const adapterParameters = adapter.parameters.map((parameter) => {
                    let parameterClassName = parameter.split(' ')[2].toLowerCase();
                    parameterClassName = parameterClassName.replace(':', 'adapter');
                    return adaptersInitialized.find((adapter) => adapter.constructor.name.toLowerCase().replace('interface', '').includes(parameterClassName));
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
        } catch (e) {
            console.log('Failed to initialize adapter: ', adapter.name, e);
        }
    }

    return adaptersInitialized;
};

const initServices = async (services: structureClass[], repositories: DbAdapter<Document>[], adapters: any[]) => {
    type ServiceParam = {
        name: string;
        parameters: string[];
        implementation: string;
    };
    type AdjacencyService = ServiceParam & {
        adj: string[];
    };
    const paramEntity = getStructure(services);

    const serviceMap = new Map<string, AdjacencyService>();

    for (let service of paramEntity) {
        serviceMap.set(service.name, {
            ...service,
            adj: []
        });
    }

    for (let service of paramEntity) {
        const {parameters} = service;
        const deps = parameters.map(p => p.split(' ')[2].split(':')[0]);

        for (let dep of deps) {
            if (serviceMap.has(dep)) {
                serviceMap.get(dep)!.adj.push(service.name);
            }
        }
    }

    const visited = new Set<string>();
    const stack: string[] = [];

    for (let service of paramEntity) {
        if (!visited.has(service.name)) {
            dfs(service.name);
        }
    }

    function dfs(node: string) {
        visited.add(node);

        const {adj} = serviceMap.get(node)!;

        for (let neighbor of adj) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }

        stack.push(node);
    }

    const initOrder = stack.reverse();

    const orderedServices = initOrder.map(
        name => serviceMap.get(name)!
    );

    console.log(orderedServices);

}

export async function initialize() {
    const Modules = getModules();
    console.log(Modules);
    // const classNameParam = getTrueStructure(args); // done
    // const {repositories, services, controllers, adapters} = separateParameters(await classNameParam); // done
    // const repos = await initRepositories(repositories); // done
    // const adapts = await initAdapters(adapters); // done
    // const servs = await initServices(services, repos, adapts); // TODO
}
