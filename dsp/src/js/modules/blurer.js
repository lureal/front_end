module.exports = function(e, iw, ih) {
    var ww = $(window).width();
    var wh = $(window).height();
    var ratio = iw / ih;

    if (ww > wh) {
        e.css({
            'width': ww,
            'height': Math.round(ww * (1 / ratio))
        });

        var newIh = Math.round(ww * (1 / ratio));
        if (newIh < wh) {
            e.css({
                'height': wh,
                'width': Math.round(wh * ratio)
            });
        }
    } else {
        e.css({
            'height': wh,
            'width': Math.round(wh * ratio)
        });

    }
    if (e.width() > $(window).width()) {
        var this_left = (e.width() - $(window).width()) / 2;
        e.css({
            'position': 'relative',
            'top': 0
        });
    }
    if (e.height() > $(window).height()) {
        var this_height = (e.height() - $(window).height()) / 2;
        e.css({
            'position': 'relative',
            'left': 0
        });
    }
};
