import {Collection} from "mongodb";

export type structureClass = {
    name: string,
    parameters: any[],
    implementation: string
};

export type MongoAdapterInput = {
    entityName: string;
    collection: Collection;
};