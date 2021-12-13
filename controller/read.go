package controller

import (
	"encoding/json"
	"spider2/model"
	"spider2/util"
)

//ReadResult for json back
type ReadResult struct {
	Code  int    `json:"code"`
	Page  string `json:"page"`
	Last  string `json:"last"`
	Next  string `json:"next"`
	Title string `json:"title"`
	Txt   string `json:"txt"`
}

//Read api
func Read(pageID string) string {
	result, _ := checkExits(pageID)
	if result {
		client := util.Connect()
		res, _ := client.Get(pageID).Result()
		page := model.PageFromJSON(res)
		msg, _ := json.Marshal(ReadResult{
			1,
			page.GetID(),
			page.GetLast(),
			page.GetNext(),
			page.GetTitle(),
			page.GetText(),
		})
		client.Close()
		return string(msg)
	}
	return ""
}
