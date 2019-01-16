//nazicp.jquery
//require jquery.js > 1.9.x
//require bootstrap.js >3.x
//require animate.css
(function ($) {

    $.fn.extend({
        //$().block();
        block: function () {
            this.attr("disabled", "disabled").button("loading");
            return this;
        },
        //$().unblock();
        unblock: function () {
            this.removeAttr("disabled").button("reset");
            return this;
        },

        toast: function (title, msg, style) {
            var html = '<div class="alert alert-' + style + ' alert-dismissible margin5 nlm nrm" role="alert">';
            html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times"></i></span></button>';
            html += '<strong>' + title + '</strong> ' + msg;
            html += '</div>';
            this.prepend(html);
            return this;
        },

        loading:function(currentIcon,icon){
            var repicon=icon || 'fa-spinner';
            this.attr({
                'data-original-icon': function(){
                    return currentIcon;
                }
            }).removeClass(currentIcon).addClass(repicon + " fa-spin");
            return this;
        },
        loadover: function (icon) {
            var repicon = icon || 'fa-spinner';
            var restoreicon = this.attr('data-original-icon');
            console.log(repicon, this.attr('data-original-icon'));
            this.removeClass(repicon + ' fa-spin').addClass(restoreicon).removeAttr('data-original-icon');
            return this;
        },
        animateCss: function (animationName, callback) {
            var animationEnd = (function (el) {
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd',
                };

                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));

            this.addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);

                if (typeof callback === 'function') callback();
            });

            return this;
        }
    });

    $.extend({
        //$.sendAjax(url, param, dataType, method, sender, sucFunc, beforeFunc, completeFunc,errFunc)
        sendAjax: function (url, param, dataType, method, sender, sucFunc, beforeFunc, completeFunc, errFunc) {
            if (beforeFunc == null) {
                beforeFunc = function () { $(sender).block(); }
            }
            if (completeFunc == null) {
                completeFunc = function () { $(sender).unblock(); }
            }

            errFunc = errFunc||function (x, h, r) {
                alert('Request Error: ' + x.status + ' ' + r);
                }

            $.ajax({
                url: url,
                data: param,
                dataType: dataType,
                type: method,
                traditional: true,
                beforeSend: beforeFunc,
                success: sucFunc,
                error: errFunc,
                complete: completeFunc
            });
        },
        //$.sendForm(url, formid, dataType, sender, sucFunc, beforeFunc, completeFunc,debug)
        sendForm: function (url, formid, dataType, sender, sucFunc, beforeFunc, completeFunc,debug) {

            var isdebug = debug || false;

            if (beforeFunc == null) {
                beforeFunc = function () { $(sender).block(); }
            }
            if (completeFunc == null) {
                completeFunc = function () { $(sender).unblock(); }
            }

            var fmdata = new FormData();
            //add Textarea
            $.each($(formid).find('textarea'), function (i, n) {
                fmdata.append($(n).attr('name'), $.trim($(n).val()));
            });

            //add select
            $.each($(formid).find('select'), function (i, n) {
                fmdata.append($(n).attr('name'), $.trim($(n).val()));
            });


            //find Input
            $.each($(formid).find('input'), function (i, n) {
                switch ($(n).attr('type')) {
                    case 'file':
                        if (n.files.length > 0) {
                            fmdata.append($(n).attr('name'), n.files[0]);
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if ($(n).prop('checked')) {
                            fmdata.append($(n).attr('name'), $(n).val());
                        }
                    case 'text':
                    case 'email':
                    case 'number':
                    case 'url':
                    case 'range':
                    case 'search':
                    case 'date':
                    case 'color':
                    default:
                        fmdata.append($(n).attr('name'), $.trim($(n).val()));
                        break;
                }
            });
            if (isdebug) {
                console.log(fmdata);
            }

            $.ajax({
                url: url,
                type: 'POST',
                cache: false,
                data: fmdata,
                dataType: dataType,
                processData: false,
                traditional: true,
                contentType: false,
                beforeSend: beforeFunc,
                success: sucFunc,
                error: function (x, h, r) {
                    alert("Request Error + " + x.status);
                },
                complete: completeFunc
            });
        },
        susplant: function (string, object) {
            return string.replace(/{([^{}]*)}/g,
                function (a, b) {
                    var r = object[b];
                    if (typeof r === 'float') {
                        return r.toFixed(2)
                    } else {
                        return typeof r === 'string' || typeof r === 'number' ? r : a;
                    }
                }
            );
        }
    });

})(jQuery);
