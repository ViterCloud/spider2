package util

import (
	"log"
	"net/http"

	"github.com/PuerkitoBio/goquery"
)

//Search for get content from web
func Search(url, tag string, handle func(int, *goquery.Selection)) {
	res, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find(tag).Each(func(i int, s *goquery.Selection) {
		handle(i, s)
	})
}
