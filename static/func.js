var bookId = '10958694',
    bookObj = {};

function getCookie(name){
    let arr,
        reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}

function setCookie(name, value){
    let days = 30,
        exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getContent(page){
    // $.ajax({
    //     url: './book.php',
    //     type: 'POST',
    //     data: { bid: bookId, page: page },
    //     dataType: 'json',
    //     beforeSend: function(xhr){
    //         $('.content').html('');
    //     },
    //     success: function(data){
    //         data.code == 1 && showData(data, page);
    //     }
    // });
}

function showData(data, page){
    // txt = data.txt.replace(/^\s+|s+$/g, '');
    $('.content').html('<p class="content-title">'+data.chapterName+'</p>'+data.txt);
    $('title').text(data.chapterName);
    $('.up').attr('data-val', parseInt(page) - 1 <= 0 ? 1 : (page - 1));
    $('.down').attr('data-val', parseInt(data.hasNext) == 1 ? (parseInt(page) + 1) : page);
    setCookie('LAST_BOOK_PAGE', page);
    $('#page').val(page);
    $('.big-box').show();
}
