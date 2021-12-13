function _scroll() {
    0 > _yOffset ? -_step > _yOffset ? (_yOffset += _step, window.scrollBy(0, -_step)) : (window.scrollBy(0, _yOffset), _yOffset = 0) : _yOffset > 0 && (_yOffset > _step ? (_yOffset -= _step, window.scrollBy(0, _step)) : (window.scrollBy(0, _yOffset), _yOffset = 0)), 0 != _yOffset && requestAnimationFrame(_scroll)
}

function addLocalStorageBookId(e) {
    if (!e) return "";
    var t = "zywap_read_book_history",
        o = store.get(t),
        a = e.toString();
    o ? -1 == o.split(",").indexOf(a) && store.set(t, a + "," + o) : store.set(t, a)
}
var API_URL = "/nextchapter",
    disabledClick = !1;
    chapterDownloadLimit = chapterDownloadLimit ? parseInt(chapterDownloadLimit) : 10;
var CHAPTER_DOWNLOAD_LIMIT = chapterDownloadLimit,
    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
    _yOffset = 0,
    _step = 60,
    _scrollTo = function (e, t) {
        /iPhone(.)*MicroMessenger/gi.test(navigator.userAgent) ? (_yOffset = e - document.body.scrollTop, t && (_step = t), requestAnimationFrame(_scroll)) : window.scrollTo(0, e)
    },
    readUi = {
        $read: $("[data-js=read]"),
        $header: $("[data-js=header]"),
        $readMenu: $("[data-js=read_menu]"),
        $readSetting: $("[data-js=read_setting]"),
        $tipsPop: $(".tips_pop"),
        $aladdinTop: $(".aladdin_top_new"),
        detectClickCenter: function (e) {
            return Math.abs(e.clientY - window.innerHeight / 2) > 100 || $(e.target).closest("[data-area=disabled]").length ? !1 : !0
        }, uiDisplay: function (e) {
            e ? (this.$header.addClass("show"), this.$readMenu.addClass("show"), $("body").removeClass("up_show")) : (this.$header.removeClass("show"), this.$readMenu.removeClass("show"), this.$readMenu.removeClass("show_ft"), $("body").addClass("up_show"))
        }, fontSizeSetting: function () {
            var e = this,
                t = store.get("ui_read_fs"),
                o = this.$readSetting.find(".fs"),
                a = 0;
            if (t) {
                for (a = 0; a < o.length; a++)
                    if (t == o.eq(a).html()) {
                        e.setFontSize(o.eq(a));
                        break
                    }
            } else a = 1, e.setFontSize(o.eq(a));
            this.$readSetting.on("click", ".fs", function () {
                e.setFontSize($(this)), store.set("ui_read_fs", $(this).html())
            })
        }, bgColorSetting: function () {
            var e = this,
                t = store.get("ui_read_bgs"),
                o = this.$readSetting.find(".bgs"),
                a = 0;
            if (t) {
                for (a = 0; a < o.length; a++)
                    if (t == o.eq(a).html()) {
                        e.setBgColor(o.eq(a));
                        break
                    }
            } else a = 0, e.setBgColor(o.eq(a));
            this.$readSetting.on("click", ".bgs", function () {
                e.setBgColor($(this)), store.set("ui_read_bgs", $(this).html())
            })
        }, setFontSize: function (e) {
            this.$read.removeClass("small normal big").addClass(e.data("fs")), e.addClass("active").siblings(".active").removeClass("active")
        }, setBgColor: function (e) {
            $("body").removeClass("light night eyes").addClass(e.data("bgs")), e.addClass("active").siblings(".active").removeClass("active")
        }, tips: function (e) {
            return null == e ? void this.$tipsPop.hide() : void this.$tipsPop.show().css({
                top: e.offset().top + 20,
                left: e.offset().left - 220
            })
        }, isFooter: function () {
            $(window).height() + $.scrollTop() == $(document).height() && readUi.$readMenu.addClass("show_ft")
        }, init: function () {
            var e = this;
            this.$header.css("position", "fixed"), $("[data-js=read]").on("click", function (t) {
                e.detectClickCenter(t) && e.uiDisplay(e.$header.hasClass("show") ? !1 : !0)
            }), $(".icon_setting").on("click", function () {
                e.$readSetting.hasClass("show") ? ($(this).removeClass("active"), e.$readSetting.removeClass("show"), $(".header_mask").hide(), $("html").removeClass("no_scroll2"), $(document).off("touchmove", _preventDefault)) : ($(this).addClass("active").siblings(".active").removeClass("active"), e.$readSetting.addClass("show"), $(".header_mask").show(), $(".header_menu").removeClass("show"), $("html").addClass("no_scroll2"), $(document).on("touchmove", _preventDefault))
            }), this.$read.on("click", function (t) {
                var o = $(t.target);
                o.closest(".tips_more").length && "none" == e.$tipsPop.css("display") ? e.tips(o.closest(".tips_more")) : o.closest(".tips_pop").length || e.tips(null)
            });
            var t = $.scrollTop();
            $(document).on("scroll", function () {
                var e = $.scrollTop();
                e > t ? (e > 50 && (readUi.$header.removeClass("show"), $("body").addClass("up_show")), readUi.$readMenu.removeClass("show")) : (readUi.$header.addClass("show"), readUi.$readMenu.removeClass("show"), readUi.$readMenu.removeClass("show_ft"), $("body").removeClass("up_show")), t = e
            }), this.fontSizeSetting(), this.bgColorSetting()
        }
    };
readUi.init();
var read = {
    $read: $("[data-js=read]"),
    $chapterName: $("[data-js=chapter_name]"),
    chapters: [1],
    chapterNames: {},
    curChapter: 1,
    bookHistory: {},
    getChapterId: function () {
        return parseInt(location.pathname.substr(location.pathname.replace(/(\/)*$/, "").lastIndexOf("/") + 1))
    }, getApiUrl: function (e) {
        return getUrl(API_URL + "/" + bookId + "/" + (void 0 != e ? e : this.curChapter), {
            share: 0 == share ? void 0 : share,
            width: realWidth,
            nextRowId: 1
        })
    }, getAnchor: function () {
        return '<a id="c' + this.curChapter + '"></a><br><br><h3 class="read_tit">' + this.chapterNames[this.curChapter] + "</h3>"
    }, goToAnchor: function () {
        return -1 !== this.chapters.indexOf(this.curChapter) ? (_scrollTo($("#c" + this.curChapter).offset().top), !0) : !1
    }, getLastChapter: function (e) {
        return store.get("read_" + e)
    }, setLastChapter: function (e) {
        store.set("read_" + e, this.curChapter), e != resourseId && store.set("read_" + resourseId, this.curChapter)
    }, setBookHistory: function () {
        this.bookHistory.curChapter = this.curChapter, store.set("history_" + bookId, JSON.stringify(this.bookHistory))
    }, jumpToLastChapter: function () {
        var e = this.getLastChapter(bookId);
        e && (this.curChapter = e, this.chapters = [], this.chapterNames = {}, this.$read.html(""))
    }, isNeedFill: function () {
        return $("body").offset().height + 13 <= document.documentElement.clientHeight
    }, autoFill: function () {
        this.isNeedFill() ? ++this.curChapter : this.autoFill = null
    }
};
read.bookHistory = store.get("history_" + bookId) ? JSON.parse(store.get("history_" + bookId)) : {
    picUrl: bookInfo.picUrl,
    name: bookInfo.name.replace(/(^《|》$)/g, ""),
    author: bookInfo.author,
    curChapter: read.curChapter,
    time: Date.now()
}, read.setBookHistory(), document.addEventListener("touchend", function (e) {
    var t = e.target;
    (/icon_back|icon_home/gi.test(t.className) || /bookChapter|next/gi.test(t.getAttribute("data-js"))) && read.setLastChapter(bookId)
}, !0);
var vChange = "",
    vState = "";
"undefined" != typeof document.visibilityState ? (vChange = "visibilitychange", vState = "visibilityState") : "undefined" != typeof document.webkitVisibilityState && (vChange = "webkitvisibilitychange", vState = "webkitVisibilityState"), vChange && document.addEventListener(vChange, function () {
    if ("hidden" == document[vState]) {
        var e = read.getLastChapter(bookId);
        (!e || e < read.curChapter) && read.setLastChapter(bookId)
    }
}), 2 != bookType && read.autoFill(), read.$read.attr("rel", read.getApiUrl(read.curChapter + 1)), $("[data-js=bookChapter]").on("click", function () {
    goUrl($(this).data("url"))
}), $(function () {
    $("[data-js=prev]").on("click", function () {
        return 1 == pageNum ? void zy.alert("当前已是第一章") : void(window.location.href = preUrl)
    }), $("[data-js=next]").on("click", function () {
        if (1 != hasNext) return void
        $.ajax({
            url: lastChapterAdUrl,
            dataType: "json",
            success: function (e) {
                0 == e.code ? ($(".read_end_ad").css("background-image", "url(" + e.body.thirdAdInfo.content + ")"), $(".read_end_ad").data("url", e.body.thirdAdInfo.url), $(".read_end_ad").data("clipboard-text", e.body.redeemProcotal), $(".read_end_ad .book_c").hide(), e.body.completeState || ($(".read_end_ad img").attr("src", e.body.picUrl), $(".read_end_ad .name").text(e.body.bookName), $(".read_end_ad .book_c").show()), $(".read_end_ad").show()) : 1 == e.code && (location.href = e.body.goUrl)
            }, error: function () {
                zy.alert("网络繁忙，请稍后重试")
            }
        });
        var e = store.get("readedChapterNum");
        return e = e || 1, e >= CHAPTER_DOWNLOAD_LIMIT + 1 ? (document.oncopy = null, store.set("readedChapterNum", 0), void(location.href = $("[data-js=window_timer]").data("url"))) : (store.set("readedChapterNum", e + 1), void(window.location.href = nextUrl))
    })
}), $(".icon_shelf").on("click", function () {
    var e = $(this);
    return e.hasClass("ed") ? void zy.alert("书籍已在书架") : checkUserLogin() ? (dataPointUrl({
        page_type: "reading",
        page_key: bookId,
        cli_res_type: "fn_join"
    }), void $.ajax({
        url: API_SHELF,
        dataType: "json",
        data: {
            bookId: bookId,
            chapterId: maxChapterId
        },
        success: function (t) {
            0 == t.code ? (zy.alert("书籍已加入书架"), e.addClass("ed")) : zy.alert(t.msg)
        }, error: function () {
            zy.alert("网络繁忙，请稍后再试")
        }
    })) : !1
}), read.$read.on("click", "a", function (e) {
    e.preventDefault()
}, {
    useCapture: !0
}), 1 == alertType ? zy.alert("注册成功，" + bookName + "已装进你的荷包", 3e3) : 2 == alertType && zy.alert("绑定成功，" + bookName + "已装进你的荷包", 3e3), addLocalStorageBookId(resourseId), document.oncontextmenu = function () {
    return !1
}, document.onselectstart = function () {
    return !1
}, document.onbeforecopy = function () {
    return !1
}, document.onmouseup = function () {
    return !1
}, document.oncopy = function () {
    return !1
}, document.onselect = function () {
    return !1
};
