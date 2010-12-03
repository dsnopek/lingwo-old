
define([], function () {
    // TODO: this gives false positives on Android 1.5 browser
    function isPositionFixedSupported(){
        var isSupported = null;
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.style) {
                el.style.position = 'fixed';
                el.style.top = '10px';
                var root = document.body;
                if (root && 
                    root.appendChild && 
                    root.removeChild)
                {
                    root.appendChild(el);
                    isSupported = (el.offsetTop === 10);
                    root.removeChild(el);
                }
            }
        }
        return isSupported;
    }

    return function () {
        // TODO: this userAgent scraping is a little simplistic.
        var ua = navigator.userAgent.toLowerCase(),
            positionFixed = isPositionFixedSupported() && !/iphone|ipod|android/.exec(ua);
        return positionFixed;
    };
});

