package util

import (
	"spider2/config"

	redis "gopkg.in/redis.v4"
)

//Connect to redis
func Connect() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     config.DBURL + ":" + config.DBPort,
		Password: config.DBPsw,
		DB:       config.DBName,
	})
	return client
}
