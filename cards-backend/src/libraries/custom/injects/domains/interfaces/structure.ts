export interface Structure {
    Controller: Component[],
    Service: Component[],
    Repository: Component[],
    Adapter: Component[]
}

export interface Component {
    className: string,
    order?: number,
    dependencies: string[]
}