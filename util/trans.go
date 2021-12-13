package util

import (
	"crypto/md5"
	"encoding/hex"

	"github.com/axgle/mahonia"
)

//ConverToString is trans func
func ConverToString(src string, srcCode string, tagCode string) string {
	srcCoder := mahonia.NewDecoder(srcCode)
	srcResult := srcCoder.ConvertString(src)
	tagCoder := mahonia.NewDecoder(tagCode)
	_, cdata, _ := tagCoder.Translate([]byte(srcResult), true)
	result := string(cdata)
	return result
}

//GbkToUtf8 is trans gbk to utf8
func GbkToUtf8(src string) string {
	return ConverToString(src, "gbk", "utf-8")
}

//ToMD5 is encoding str by md5
func ToMD5(str string) string {
	h := md5.New()
	h.Write([]byte(str))
	return hex.EncodeToString(h.Sum(nil))
}
