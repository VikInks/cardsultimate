export interface TcpClientPoolInterface {
    getConnection(): Promise<any>;
    releaseConnection(client: any): void;
}