import RedisSession from 'telegraf-session-redis'

const session = new RedisSession({
  store: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  ttl: 120,
})

export default session
