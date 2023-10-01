// adapter for axios

export interface RequestAx {
    get(url: string, config?: any): Promise<any>;
    post(url: string, data?: any, config?: any): Promise<any>;
    put(url: string, data?: any, config?: any): Promise<any>;
    patch(url: string, data?: any, config?: any): Promise<any>;
    delete(url: string, config?: any): Promise<any>;
    head(url: string, config?: any): Promise<any>;
    options(url: string, config?: any): Promise<any>;
}

export interface AxiosInterface {
    request: RequestAx;
}