package model

import "encoding/json"

//Content model
type Content struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
}

//SetTitle for title
func (c Content) SetTitle(t string) {
	c.Title = t
}

//SetText for text
func (c Content) SetText(t string) {
	c.Text = t
}

//ToJSON for json
func (c Content) ToJSON() string {
	str, err := json.Marshal(c)
	if err != nil {
		return ""
	}
	return string(str)
}

//NewContent for build page model
func NewContent(id string, title string, text string) Content {
	c := Content{
		id,
		title,
		text,
	}
	return c
}
