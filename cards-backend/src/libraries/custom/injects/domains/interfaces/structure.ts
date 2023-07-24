export interface Structure {
    Controller: Component[],
    Service: Component[],
    Repository: Component[],
    Adapter: Component[]
}

interface Component {
    className: string,
    order?: number,
    dependencies: string[]
}