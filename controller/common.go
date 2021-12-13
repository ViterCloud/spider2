package controller

import (
	"spider2/util"
)

func checkExits(ID string) (bool, string) {
	client := util.Connect()
	value, err := client.Get(ID).Result()
	client.Close()
	if err != nil {
		return false, ""
	}
	return true, value
}
