let content = {
        prev: null,
        now: null,
        next: null
    },
    content_H = window.screen.height * 0.8,
    ajax_status = true;

function boxText(data, page, position) {
    $('.handle-box').empty().html(data.txt);
    let page_height = 0,
        page_arr = [],
        page_text = '';
    $('.handle-box').find('p').each(function(k, v) {
        let pH = $(v)[0].clientHeight + parseInt($(v).css('margin-bottom'));
        if (page_height + pH <= content_H) {
            page_text += $(v)[0].outerHTML;
            page_height += pH;
        } else {
            page_arr.push(page_text);
            page_text = $(v)[0].outerHTML;
            page_height = pH;
        }
    });
    page_arr.push(page_text);
    content[position] = {
        title: data.title,
        page: page,
        last: data.last,
        next: data.next,
        page_num: page_arr.length,
        page_no: position == 'prev' ? (page_arr.length - 1) : 0,
        page_arr: page_arr
    };
    showPage();
    checkEmpty();
}

function clearContent() {
    content = {
        prev: null,
        now: null,
        next: null
    };
}

function nextPage() {
    if (content.now.page_arr.length == (content.now.page_no + 1)) {
        if (content.next == null) {
            alert('No more page.');
            return false;
        }
        content.prev = content.now;
        content.now = content.next;
        content.next = null;
    } else {
        content.now.page_no += 1;
    }
    showPage();
    checkEmpty();
}

function previousPage() {
    if (content.now.page_no == 0) {
        if (content.prev == null) {
            alert('This is the first page.');
            return false;
        }
        content.next = content.now;
        content.now = content.prev;
        content.prev = null;
    } else {
        content.now.page_no -= 1;
    }
    showPage();
    checkEmpty();
}

function fixBookInfo(title) {
    $('.bottom-gide .book-name').text($('#bookId option:selected').text());
    $('.bottom-gide .book-title').text(title);
    $('.pageInfo .prev-icon').attr('data', content.prev == null ? 'null' : 'has');
    $('.pageInfo .next-icon').attr('data', content.next == null ? 'null' : 'has');
}

function showPage() {
    $('#readBox').empty().html(content.now.page_arr[content.now.page_no]);
    setCookie('LAST_BOOK_PAGE_' + $('#bookId').val(), content.now.page);
    setCookie('READ_BOOK_ID', $('#bookId').val());
    $('title').text(content.now.title);
    $('#page').val(content.now.page);
    fixBookInfo(content.now.title);
}

function hide(_this) {
    $(_this).parents('.head-box').hide();
}

function getCookie(name) {
    let arr,
        reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function switchModel(change = false) {
    let time = new Date().getHours(),
        model = 8 < time && time < 22 ? 'day' : 'night';
    if (change) {
        model = $('#model').val().toLowerCase() == 'day' ? 'night' : 'day';
    }
    $('body').attr('class', '').addClass(model + '-model');
    $('#model').val(model.slice(0, 1).toUpperCase() + model.slice(1));
}

function setCookie(name, value) {
    let days = 30,
        exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}


function getContent(page, position) {
    $.ajax({
        url: 'http://localhost:233/spider',
        type: 'POST',
        data: {
            action: 'read',
            pageId: page
        },
        dataType: 'json',
        beforeSend: function() {
            if (ajax_status) {
                ajax_status = false;
            } else {
                return false;
            }
        },
        success: function(data) {
            ajax_status = true;
            data.code == 1 && boxText(data, page, position);
        }
    });
}

function updateBook(bookId) {
    $.ajax({
        url: 'http://localhost:233/spider',
        type: 'POST',
        data: {
            action: 'update',
            bookId: bookId
        },
        dataType: 'json',
        beforeSend: function() {
            if (ajax_status) {
                ajax_status = false;
            } else {
                return false;
            }
        },
        success: function(data) {
            ajax_status = true;
            data.code == 1 && alert('Update Success. New ' + data.num + ' page');
        }
    })
}

function checkEmpty() {
    if (content.prev == null && content.now.last != '') {
        getContent(content.now.last, 'prev');
    }
    if (content.next == null && content.now.next != '') {
        getContent(content.now.next, 'next');
    }
}
