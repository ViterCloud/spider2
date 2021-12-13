package model

import "encoding/json"

//Page model
type Page struct {
	ID    string `json:"id"`
	URL   string `json:"url"`
	Last  string `json:"last"`
	Next  string `json:"next"`
	Title string `json:"title"`
	Text  string `json:"text"`
}

//GetID for id
func (p Page) GetID() string {
	return p.ID
}

//GetURL for url
func (p Page) GetURL() string {
	return p.URL
}

//GetLast for last
func (p Page) GetLast() string {
	return p.Last
}

//GetNext for next
func (p Page) GetNext() string {
	return p.Next
}

//GetTitle for next
func (p Page) GetTitle() string {
	return p.Title
}

//GetText for next
func (p Page) GetText() string {
	return p.Text
}

//ToJSON for json
func (p Page) ToJSON() string {
	str, err := json.Marshal(p)
	if err != nil {
		return ""
	}
	return string(str)
}

//PageFromJSON build page by json
func PageFromJSON(str string) Page {
	var p Page
	json.Unmarshal([]byte(str), &p)
	return p
}

//NewPage for build page model
func NewPage(id string, url string, last string, next string, title string, text string) Page {
	p := Page{
		id,
		url,
		last,
		next,
		title,
		text,
	}
	return p
}
