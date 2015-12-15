/**
 * Created by li on 2015/11/27.
 */
 // Á¬½Ó redis

var config = require('../Config/sysconfig');
var Redis = require('ioredis');

var client = new Redis({
    port: config.redisConfig.redis_port,
    host: config.redisConfig.redis_host,
    db: config.redisConfig.redis_db,
    password:config.redisConfig.redis_password
});

client.on('error', function (err) {
    if (err) {
        console.error('connect to redis error, check your redis config', err);
        process.exit(1);
    }
})

exports = module.exports = client;
