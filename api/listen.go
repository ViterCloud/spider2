package api

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"spider2/controller"
	"strings"
)

func cors(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Credentials", "true")
		f(w, r)
	}
}

//Start Server
func Start() {
	http.Handle("/spider/static/", http.StripPrefix("/spider/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/spider", cors(route))
	server := http.Server{
		Addr: "localhost:233",
	}
	server.ListenAndServe()
}

func route(response http.ResponseWriter, request *http.Request) {
	switch strings.ToUpper(request.Method) {
	case "POST":
		handlePost(response, request)
	case "GET":
		handleGet(response, request)
	}
}

func handleGet(response http.ResponseWriter, request *http.Request) {
	t, err := template.ParseFiles("html/index.html")
	if err != nil {
		log.Fatalln(err)
	} else {
		_ = t.Execute(response, nil)
	}
}

func handlePost(response http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		fmt.Println("Parse Form error")
	}
	action := request.Form.Get("action")
	var msg = ""
	if action != "" {
		switch action {
		case "update":
			msg = controller.Update(request.Form.Get("bookId"))
		case "read":
			msg = controller.Read(request.Form.Get("pageId"))
		}
		if msg != "" {
			response.Header().Set("content-type", "text/json")
			response.Write([]byte(msg))
		}
	}
}
