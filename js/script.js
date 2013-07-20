$(document).ready(function() {
    $('.container').height($(window).outerHeight(true) - ($(window).outerHeight(true) - $(window).height() + 5) - $('.header').height());
    $('.one').simpleWindows({
        php: {
            file: false
        },
        headerText: 'http://atandrastoth.co.uk/advtable/',
        dimension: {
            top: 40,
            left: 40,
            width: 1000,
            height: 300
        }
    });
    $('.two').simpleWindows({
        source: $('<textarea style =  "width:100%;height:100%;"></textarea>'),
        headerText: 'Table from Database  - press alt + r to refresh -',
        funcKey: 'altKey',
        arrangeKey: 'c',
        keys: {
            loadKey: {
                key: 'r',
                order: 'sql',
                param: 100,
                phpFile: 'com.php',
                resFunction: function() {
                    simWinGlobal.winBody.html('<div style = "width:100%;height:100%;overflow:auto">---- LOADING ----</div>');
                    var retVal = simWinGlobal.active.simpleWindows.ajaxCall(this.phpFile, this.order, this.param);
                    simWinGlobal.winBody.html('<div style = "width:100%;height:100%;overflow:auto">' + retVal + '</div>');
                }
            }
        },
        dimension: {
            top: 80,
            left: 80,
            width: 800,
            height: 300,
        }
    });
    $('.three').simpleWindows({
        headerText: 'Note  - press alt + l -',
        dimension: {
            top: 120,
            left: 120,
            width: 800,
            height: 400
        },
        keys: {
            loadKey: {
                key: 'l',
                order: 'note_read',
                param: '',
                phpFile: 'com.php',
                resFunction: function() {
                    var retVal = simWinGlobal.active.simpleWindows.ajaxCall(this.phpFile, this.order, this.param);
                    simWinGlobal.winBody.html('<textarea id = "texts" style = "width:100%;height:100%;overflow:auto">' + retVal + '</textarea>');
                    $('#texts').focusin();
                }
            },
            saveKey: {
                key: 's',
                order: 'note_write',
                param: '',
                phpFile: 'com.php',
                resFunction: function() {
                    var cont = simWinGlobal.winBody.children().val();
                    simWinGlobal.active.simpleWindows.ajaxCall(this.phpFile, this.order, cont);
                }
            }
        }
    })
    $('[name="viewDoc"]').click(function() {
        $('.overlay').fadeIn();
        $('.documentWrapper').fadeIn();
    });
    areaSetSyntax($('[name="htmlCode"]'),"text/html");
    areaSetSyntax($('[name="params"]'),"application/javascript");
    areaSetSyntax($('[name="php"]'),"application/x-httpd-php");
    $('.documentWrapper').css('display','none');
    $('.close').click(function(){
        $('.overlay').fadeOut();
        $('.documentWrapper').fadeOut();        
    })
});

function areaSetSyntax(argument,mode) {
    var editor = CodeMirror.fromTextArea(argument[0], {
        mode: mode,
        tabMode: "indent",
        readOnly: true
    });
    editor.setOption("theme", "monokai");
    argument.next('div').css({
        'text-align': 'left',
        'height': '18em'
    });

}

function randomed() {
    var w = $('.container').width() - 500;
    var h = $('.container').height() - 300;
    h = Math.floor((Math.random() * h) + 1);
    w = Math.floor((Math.random() * w) + 1);

    $('<div>').appendTo('.container').simpleWindows({
        dimension: {
            top: h,
            left: w,
            width: 500,
            height: 300
        }
    })
}