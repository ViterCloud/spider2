package controller

import (
	"encoding/json"
	"log"
	"spider2/config"
	"spider2/model"
	"spider2/util"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

//UpdateResult for json back
type UpdateResult struct {
	Code int `json:"code"`
	Num  int `json:"num"`
}

//Update for update book
func Update(bookID string) string {
	log.Println("Start Update Book: " + bookID)
	var latest = 0
	var num = 0
	exits, l := checkExits(bookID + config.PageLatestTag)
	if exits {
		latest, _ = strconv.Atoi(l)
	}
	url := config.BookDomain + config.BookLinkPerfix + bookID + "/"
	util.Search(url, config.PageBoxTag, func(z int, box *goquery.Selection) {
		box.Find(config.PageLineTag).Each(func(y int, line *goquery.Selection) {
			link, _ := line.Find(config.PageLinkTag).Attr(config.PageLinkAttr)
			pageID := strings.Replace(strings.Replace(link, config.BookLinkPerfix+bookID+"/", "", 1), config.PageLinkSuffix, "", 1)
			pages, _ := strconv.Atoi(pageID)
			if !exits || (latest < pages) {
				title := strings.Replace(line.Find(config.PageLinkTag).Text(), "聽", " ", -1)
				result, _ := checkExits(pageID)
				if !result {
					log.Println("Update Page " + title)
					downloadPage(bookID, pageID, title)
					num++
				}
			}
		})
	})
	log.Println("Update Book Finish")
	msg, _ := json.Marshal(UpdateResult{
		1,
		num,
	})
	return string(msg)
}

func downloadPage(bookID string, pageID string, title string) {
	_, last := checkExits(bookID + config.PageLatestTag)
	url := config.BookDomain + config.BookLinkPerfix + bookID + "/" + pageID + config.PageLinkSuffix
	page := model.NewPage(pageID, url, last, "", title, "")
	util.Search(url, config.ContentBoxTag, func(z int, box *goquery.Selection) {
		txt := ""
		box.Find(config.ContentLineTag).Each(func(y int, line *goquery.Selection) {
			txt = txt + (config.PartStartTag + line.Text() + config.PartEndTag)
		})
		page.Text = txt
		client := util.Connect()
		err := client.Set(page.GetID(), page.ToJSON(), 0).Err()
		if err != nil {
			log.Fatalln("Download page " + pageID + "error")
		}
		if last != "" {
			res, _ := client.Get(last).Result()
			pl := model.PageFromJSON(res)
			pl.Next = pageID
			client.Set(pl.GetID(), pl.ToJSON(), 0).Err()
		}
		err = client.Set(bookID+config.PageLatestTag, pageID, 0).Err()
		if err != nil {
			log.Fatalln("Update lastest error")
		}
		client.Close()
	})
}
