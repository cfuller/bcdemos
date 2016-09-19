(function() {

    console.log("INSIDE BOLTJS")
    var defaults = {
            0: {
                src: "example-thumbnail.png"
            }
        },
        extend = function() {
            var args, target, i,
                object, property;
            args = Array.prototype.slice
                .call(arguments);
            target = args.shift() || {};
            for (i in args) {
                object = args[i];
                for (property in
                    object) {
                    if (object.hasOwnProperty(
                            property
                        )) {
                        if (typeof object[
                                property
                            ] ===
                            "object"
                        ) {
                            target[
                                    property
                                ] =
                                extend(
                                    target[
                                        property
                                    ],
                                    object[
                                        property
                                    ]
                                )
                        } else {
                            target[
                                    property
                                ] =
                                object[
                                    property
                                ]
                        }
                    }
                }
            }
            return target
        },
        getComputedStyle = function(
            el, pseudo) {
            return function(prop) {
                if (window.getComputedStyle) {
                    return window
                        .getComputedStyle(
                            el,
                            pseudo
                        )[
                            prop
                        ]
                } else {
                    return el.currentStyle[
                        prop
                    ]
                }
            }
        },
        offsetParent = function(el) {
            if (el.nodeName !==
                "HTML" &&
                getComputedStyle(el)
                (
                    "position") ===
                "static") {
                return offsetParent(
                    el.offsetParent
                )
            }
            return el
        },
        getVisibleWidth = function(
            el, width) {
            var clip;
            if (width) {
                return parseFloat(
                    width)
            }
            clip = getComputedStyle(
                el)("clip");
            if (clip !== "auto" &&
                clip !== "inherit") {
                clip = clip.split(
                    /(?:\(|\))/
                )[1].split(
                    /(?:,| )/);
                if (clip.length ===
                    4) {
                    return parseFloat(
                            clip[1]
                        ) -
                        parseFloat(
                            clip[
                                3])
                }
            }
            return 0
        },
        getScrollOffset = function() {
            if (window.pageXOffset) {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                }
            }
            return {
                x: document.documentElement
                    .scrollLeft,
                y: document.documentElement
                    .scrollTop
            }
        };
    videojs.plugin("thumbnails",
        function(options) {
            var div, settings,
                img, player,
                progressControl,
                duration,
                moveListener,
                moveCancel;
            settings = extend({},
                defaults,
                options);
            player = this;
            (function() {
                var
                    progressControl,
                    addFakeActive,
                    removeFakeActive;
                if (
                    navigator
                    .userAgent
                    .toLowerCase()
                    .indexOf(
                        "android"
                    ) !==
                    -1) {
                    progressControl
                        =
                        player
                        .controlBar
                        .progressControl;
                    addFakeActive
                        =
                        function() {
                            progressControl
                                .addClass(
                                    "fake-active"
                                )
                        };
                    removeFakeActive
                        =
                        function() {
                            progressControl
                                .removeClass(
                                    "fake-active"
                                )
                        };
                    progressControl
                        .on(
                            "touchstart",
                            addFakeActive
                        );
                    progressControl
                        .on(
                            [
                                "touchend",
                                "touchcancel"
                            ],
                            removeFakeActive
                        )
                }
            })();
            div = document.createElement(
                "div");
            div.className =
                "vjs-thumbnail-holder";
            img = document.createElement(
                "img");
            div.appendChild(img);
            img.src = settings[
                "0"].src;
            img.className =
                "vjs-thumbnail";
            extend(img.style,
                settings[
                    "0"].style
            );
            if (!img.style.left &&
                !img.style.right
            ) {
                img.onload =
                    function() {
                        img.style
                            .left = -
                            (
                                img
                                .naturalWidth /
                                2
                            ) +
                            "px"
                    }
            }
            duration = player.duration();
            player.on(
                "durationchange",
                function(
                    event) {
                    duration
                        =
                        player
                        .duration()
                });
            player.on(
                "loadedmetadata",
                function(
                    event) {
                    duration
                        =
                        player
                        .duration()
                });
            progressControl =
                player.controlBar
                .progressControl;
            progressControl.el()
                .appendChild(
                    div);
            moveListener =
                function(event) {
                    var
                        mouseTime,
                        time,
                        active,
                        left,
                        setting,
                        pageX,
                        right,
                        width,
                        halfWidth,
                        pageXOffset,
                        clientRect;
                    active = 0;
                    pageXOffset
                        =
                        getScrollOffset()
                        .x;
                    clientRect =
                        offsetParent(
                            progressControl
                            .el()
                        ).getBoundingClientRect();
                    right = (
                            clientRect
                            .width ||
                            clientRect
                            .right
                        ) +
                        pageXOffset;
                    pageX =
                        event.pageX;
                    if (event.changedTouches) {
                        pageX =
                            event
                            .changedTouches[
                                0
                            ].pageX
                    }
                    left =
                        pageX ||
                        event.clientX +
                        document
                        .body
                        .scrollLeft +
                        document
                        .documentElement
                        .scrollLeft;
                    left -=
                        offsetParent(
                            progressControl
                            .el()
                        )
                        .getBoundingClientRect()
                        .left +
                        pageXOffset;
                    mouseTime =
                        Math.floor(
                            (
                                left -
                                progressControl
                                .el()
                                .offsetLeft
                            ) /
                            progressControl
                            .width() *
                            duration
                        );
                    for (time in
                        settings
                    ) {
                        if (
                            mouseTime >
                            time
                        ) {
                            active
                                =
                                Math
                                .max(
                                    active,
                                    time
                                )
                        }
                    }
                    setting =
                        settings[
                            active
                        ];
                    if (setting
                        .src &&
                        img.src !=
                        setting
                        .src) {
                        img.src =
                            setting
                            .src
                    }
                    if (setting
                        .style &&
                        img.style !=
                        setting
                        .style) {
                        extend(
                            img
                            .style,
                            setting
                            .style
                        )
                    }
                    width =
                        getVisibleWidth(
                            img,
                            setting
                            .width ||
                            settings[
                                0
                            ].width
                        );
                    halfWidth =
                        width /
                        2;
                    if (left +
                        halfWidth >
                        right) {
                        left -=
                            left +
                            halfWidth -
                            right
                    } else if (
                        left <
                        halfWidth
                    ) {
                        left =
                            halfWidth
                    }
                    var w2 =
                        img.offsetWidth;
                    var maxRight =
                        player.currentWidth() -
                        w2 /
                        2;
                    var minLeft =
                        w2 / 2;
                    if (left <
                        minLeft
                    ) {
                        left =
                            minLeft
                    } else if (
                        left >
                        maxRight
                    ) {
                        left =
                            maxRight
                    }
                    div.style.left =
                        left +
                        "px"
                };
            progressControl.on(
                [
                    "mousemove",
                    "touchmove"
                ],
                moveListener
            );
            moveCancel =
                function(event) {
                    div.style.left =
                        "-1000px"
                };
            progressControl.on(
                ["mouseout",
                    "touchcancel",
                    "touchend"
                ],
                moveCancel);
            player.on(
                "userinactive",
                moveCancel)
        })
})();
var player = videojs("player");
player.one("loadedmetadata", function() {
    var boltRegEx =
        /http(s)?:\/\/.*.boltdns.net\/.*\/(\d+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
    var duration = player.duration();
    var url =
        "http://media.us-east-1.prod-a.boltdns.net/image/v1/jit/{ACCID}/{BOLTID}/main/{SIZE}/{TIME}/match/image.png";
    var accId, boltId;
    var interval = 2;
    var size = Math.floor(
            player.currentWidth() /
            5) + "x" +
        Math.floor(player.currentHeight() /
            5);
    var thumbnaildata = [];
    var currentSrc = player.currentSrc();
    var result = currentSrc.match(
        boltRegEx);
    if (result) {
        accId = result[2];
        boltId = result[3];
        url = url.replace(
            "{ACCID}",
            accId).replace(
            "{BOLTID}",
            boltId);
        player.poster(url.replace(
            "{TIME}",
            "25s").replace(
            "{SIZE}",
            Math.floor(
                player.currentWidth()
            ) +
            "x" + Math.floor(
                player.currentHeight()
            )));
        url = url.replace(
            "{SIZE}", size);
        for (var i = 0; i <
            duration; i +=
            interval) {
            thumbnaildata[i] = {
                src: url.replace(
                    "{TIME}",
                    i +
                    "s"
                ),
                width: "60px"
            }
        }
        console.log("INITIALIXING THUNBMAIL*********************")
        player.thumbnails(
            thumbnaildata)
    }
});