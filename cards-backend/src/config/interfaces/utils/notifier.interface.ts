export interface NotifierInterface {
    notify(channelId: string, content: string): Promise<void>;
}