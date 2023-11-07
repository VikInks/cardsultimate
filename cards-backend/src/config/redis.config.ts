export const REDIS_CONFIG : any = {
    host: process.env.REDIS_HOST || '0.0.0.0',
    port: parseInt(process.env.REDIS_PORT || '6379')
};

export const REDIS_TIMER = {
    ONE_MINUTE: 60,
    ONE_HOUR: 60 * 60,
    ONE_DAY: 60 * 60 * 24,
    ONE_WEEK: 60 * 60 * 24 * 7,
    ONE_MONTH: 60 * 60 * 24 * 30
}