let adjust = ({ $ele, width, height }) => {
    let winWidth = $(window).width();
    let winHeight = $(window).height();
    let ratio = width / height;

    // 窗口宽度大于窗口高度
    if (winWidth > winHeight) {
        $ele.css({
            width: winWidth,
            height: window.Math.round(winWidth * (1 / ratio))
        });

        let newHeight = window.Math.round(winWidth * (1 / ratio));
        if (newHeight < winHeight) {
            $ele.css({
                height: winHeight,
                width: window.Math.round(winHeight * ratio)
            });
        }

    // 窗口宽度小于窗口高度
    } else {
        $ele.css({
            height: winHeight,
            width: window.Math.round(winHeight * ratio)
        });
    }
};

export default ({ $ele, width, height }) => {
    adjust({ $ele: $ele, width: width, height: height });
    $(window).bind('resize', () => {
        adjust({ $ele: $ele, width: width, height: height });
    });
};
