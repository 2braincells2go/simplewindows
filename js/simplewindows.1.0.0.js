/*
 *  Project: simplewindows
 *  Description: windows in your browser
 *  Author: Tóth András
 *  Web: http://atandrastoth.co.uk/webdesign
 *  email: atandrastoth.gmail.com
 *  License: MIT
 */

(function($, window, document, undefined) {
    // global events
    (typeof simWinGlobal) == 'undefined' ? simWinGlobal = {} : simWinGlobal = simWinGlobal;

    var pluginName = "simpleWindows",
        defaults = {
            source: $('<textarea style =  "width:100%;height:100%;"></textarea>'),
            headerText: 'New Window',
            funcKey: 'altKey',
            arrangeKey: 'c',
            keys: {},
            dimension: {
                top: 20,
                left: 20,
                width: 800,
                height: 300
            },
            event: {
                clickY: 0,
                clickX: 0
            }
        }

    simWinGlobal.Parent = undefined;
    simWinGlobal.active = 0;
    simWinGlobal.move = false;
    simWinGlobal.resize = false;

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);
        this.options.arrangeKey = this.options.arrangeKey.charCodeAt(0) - 32;
        var keyDef = this.options.keys;

        $.each(keyDef, function(index) {
            var curKey = $(this)[0];
            if (typeof curKey.key != undefined && !$.isNumeric(curKey.key)) {
                curKey.key = curKey.key.charCodeAt(0) - 32;
            }
        });

        this._defaults = defaults;
        this._name = pluginName;
        this.Parent = element.parentElement || element.parentNode;
        this.init();

        $(this.Parent).off();
        $(this.Parent).on({
            mousemove: function(event) {
                event.preventDefault();
                $.fn.simpleWindows.set(event)
            },
            mouseup: function() {
                simWinGlobal.Parent.children('.winBox').children('.winResize').removeClass('winResizeClicked');
                simWinGlobal.move = false;
                simWinGlobal.resize = false;
            },
            mouseleave: function() {
                simWinGlobal.Parent.children('.winBox').children('.winResize').removeClass('winResizeClicked');
                simWinGlobal.move = false;
                simWinGlobal.resize = false;
            }
        })
        $(document).off('keyup');
        $(document).on({
            keyup: function(event) {
                event.preventDefault();
                $.fn.simpleWindows.key(event)
            }
        })

    }

    Plugin.prototype = {

        init: function() {
            // winBox create 
            var winBox = $(this.element);

            var chi;
            // check element under div
            if (winBox.children()) {
                chi = winBox.html();
            }
            winBox.css('opacity', 0);
            winBox.addClass('winBox');

            var el = '<div class="winHeader" unselectable="on" title="Restore Down">';
            el += '<span></span>';
            el += '</div>';
            el += '<div class="winClose" title="Close"></div>';
            el += '<div class="winMinimize" title="Minimize"></div>';
            el += '<div class="winBody"></div>';
            el += '<div class="winResize"></div>';

            winBox.html(el);
            var use = this.options.dimension;
            winBox.css({
                top: use.top,
                left: use.left,
                width: use.width,
                height: use.height
            });

            var oldCSS = new Object();

            // winbox elements
            var winHeader = winBox.children('.winHeader');
            var winBody = winBox.children('.winBody');
            var winMinimize = winBox.children('.winMinimize');

            // winheader text add from options 
            winHeader.children('span').html(this.options.headerText);
            // winbody append from source or under a source div and set the dimensions
            if (chi.length != 0) {
                winBody.html(chi);
            } else {
                winBody.append(this.options.source);
            }

            this.options.source = winBody.html();

            winBody.height(winBox.height() - winHeader.height())

            simWinGlobal.active = winBox;
            winBox.attr('tabindex', 0);
            simWinGlobal.Parent = winBox.parent();
            simWinGlobal.winBody = winBox.children('.winBody');

            z = $.fn.simpleWindows.getMaxZ(simWinGlobal.Parent.children('.winBox'));

            winBox.css('z-index', z + 1);

            winBox.on({
                click: function() {
                    winBox.children('.winBody').remove();
                    winBox.fadeOut(100, function() {
                        winBox.remove();
                        delete winBox
                    })
                }
            }, '.winClose')

            winBox.on({
                mousedown: function() {
                    simWinGlobal.active = $(this);
                    $(this).focus();
                    simWinGlobal.Parent = $(this).parent();
                    simWinGlobal.winBody = $(this).children('.winBody');
                    var z = $.fn.simpleWindows.getMaxZ($(this).parent().children('.winBox'));
                    winBox.css('z-index', z + 1);
                }
            })

            winBox.on({
                dblclick: function() {
                    winBox.data().plugin_simpleWindows.resizeTo($(this).parent('.winBox'), 'fullScreen');
                },
                mousedown: function(event) {
                    simWinGlobal.Parent.children('.winBox').children('.winResize').addClass('winResizeClicked');
                    event.preventDefault();
                    winBox.data().plugin_simpleWindows.getCilck(winBox, event);
                    simWinGlobal.move = true;
                }
            }, '.winHeader')

            winBox.on({
                mousedown: function(event) {
                    simWinGlobal.Parent.children('.winBox').children('.winResize').addClass('winResizeClicked');
                    event.preventDefault();
                    winBox.data().plugin_simpleWindows.getCilck(winBox, event);
                    simWinGlobal.resize = true;
                }
            }, '.winResize')

            winBox.on({
                click: function() {
                    winBox.data().plugin_simpleWindows.resizeTo($(this).parent('.winBox'), 'minimize');
                }
            }, '.winMinimize')

            winBox.animate({
                opacity: 1
            }, 100)
        },
        getCilck: function(obj, ev) {
            var tevent = obj.data().plugin_simpleWindows.options.event;
            tevent.clickX = (ev.offsetX || ev.originalEvent.layerX) + (obj.outerWidth(true) - obj.width()) / 2;
            tevent.clickY = (ev.offsetY || ev.originalEvent.layerY) + (obj.outerHeight(true) - obj.height()) / 2;
        },
        resizeTo: function(el, type) {
            var currCSS = el.data().plugin_simpleWindows.options.dimension;
            var p = el.parent();
            if (type == 'fullScreen') {
                var css = {
                    top: 0,
                    left: 0,
                    width: p.outerWidth(true) - (el.outerWidth(true) - el.width()) - (p.outerWidth(true) - p.width()),
                    height: p.outerHeight(true) - (el.outerHeight(true) - el.height()) - (p.outerHeight(true) - p.height())
                };

            } else {
                var css = {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: el.children('.winHeader').height()
                };

            }

            if (currCSS.width != css.width && currCSS.height != css.height) {
                oldCSS = currCSS;
                el.animate(css, 100);
                el.data().plugin_simpleWindows.options.dimension = css;
                el.children('.winBody').animate({
                    height: css.height - el.children('.winHeader').height()
                }, 100)
            } else {
                el.animate(oldCSS, 100);
                el.data().plugin_simpleWindows.options.dimension = oldCSS;
                el.children('.winBody').animate({
                    height: oldCSS.height - el.children('.winHeader').height()
                }, 100)
            }
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
    $.fn[pluginName].key = function(event) {
        var arKey = simWinGlobal.active.data().plugin_simpleWindows.options.arrangeKey;
        var keys = simWinGlobal.active.data().plugin_simpleWindows.options.keys;
        var funcKey = simWinGlobal.active.data().plugin_simpleWindows.options.funcKey;
        if (event[funcKey] == false) {
            return;
        }
        if (event.keyCode == arKey) {
            var wins = simWinGlobal.Parent.children('.winBox');
            var ind = simWinGlobal.active.index();
            var max = $.fn.simpleWindows.getMaxZ(wins);
            if (ind < wins.length - 1) {
                ind++;
            } else {
                ind = 0;
            }
            simWinGlobal.active = wins.eq(ind);
            simWinGlobal.Parent = wins.eq(ind).parent();
            simWinGlobal.winBody = wins.eq(ind).children('.winBody');
            wins.eq(ind).css('z-index', max + 1);
            return;
        }
        $.each(keys, function(ind) {
            var th = $(this)[0]
            if (event.keyCode == th.key) {
                th.resFunction()
            }
        })
    };
    $.fn[pluginName].getMaxZ = function(obj) {
        var cur = 0;
        var max = 0;
        $.each(obj, function(index) {
            cur = Number($(this).css('z-index'));
            if (cur > max) {
                max = cur
            }
        })
        return max
    };
    $.fn[pluginName].ajaxCall = function(file, order, param) {
        var retVal = false;
        if (file) {
            $.ajax({
                url: file,
                type: 'POST',
                dataType: 'xml/html/script/json/jsonp',
                data: {
                    order: order,
                    param: param
                },
                async: false,
                complete: function(data, xhr, textStatus) {
                    retVal = data.responseText;
                },
                success: function(data, textStatus, xhr) {

                },
                error: function(xhr, textStatus, errorThrown) {

                }
            });
        }
        return retVal;
    }

    $.fn[pluginName].set = function(event) {
        if (typeof simWinGlobal.active != 'undefined' && (simWinGlobal.resize || simWinGlobal.move)) {
            var box = simWinGlobal.active;
            var parent = simWinGlobal.Parent;
            var css = box.data().plugin_simpleWindows.options.dimension;
            var clY = event.pageY;
            var clX = event.pageX;
            if (simWinGlobal.resize) {
                css.width = clX - box.offset().left;
                css.height = clY - box.offset().top;
                box.css({
                    width: css.width,
                    height: css.height
                });
                box.children('.winBody').height(css.height - box.children('.winHeader').height());
            } else if (simWinGlobal.move) {
                var clkX = box.data().plugin_simpleWindows.options.event.clickX;
                var clkY = box.data().plugin_simpleWindows.options.event.clickY;
                if (clY - parent.offset().top - clkY < 0) {
                    css.top = 0;
                } else {
                    css.top = clY - parent.offset().top - clkY;
                }
                if (clX - parent.offset().left - clkX < 0) {
                    css.left = 0;
                } else {
                    css.left = clX - parent.offset().left - clkX;
                }
                box.css({
                    top: css.top,
                    left: css.left
                });
            }
        }
    };
})(jQuery, window, document);