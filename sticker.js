/**
 * Sticker.js: A Javascript library that allows you to create a Sticker Effect
 *
 * @project-site    http://stickerjs.cmiscm.com/
 * @repository        https://github.com/cmiscm/stickerjs
 * @author            Jongmin Kim - cmiscm.com
 * @version        1.0 (2014/02/05)
 * @license            MIT License
 */

(function () {

    function SimpleCircle(x, y, r) {
        this.centerX = x;
        this.centerY = y;
        this.radius = r;
    };

    SimpleCircle.prototype = {
        distanceTo: function(pageX, pageY) {
            return Math.sqrt(Math.pow(pageX - this.centerX, 2) + Math.pow(pageY - this.centerY, 2));
        },
        includesXY: function(x, y) {
            return this.distanceTo(x, y) <= this.radius;
        }
    };

    var circle;
    var _direction, _savePos = null,
        _prefixes = ['webkit', 'Moz', 'ms', 'O'],
        _aniTrans = 'all 0.6s cubic-bezier(.23,1,.32,1)',
        _setTrans = 'all 0s',
        newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    .shadowL {background: -moz-linear-gradient(right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, right top, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowR {background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowB {background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowT {background: -moz-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left bottom, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}"));
    document.head.appendChild(newStyle);

    function vendor(el, prop) {
        var s = el.style, pp, i;
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (i = 0; i < _prefixes.length; i++) {
            pp = _prefixes[i] + prop;
            if (s[pp] !== undefined) return pp;
        }
        if (s[prop] !== undefined) return prop;
    }

    function applyCss(el, prop) {
        for (var n in prop) {
            if (prop.hasOwnProperty(n)) {
                el.style[vendor(el, n) || n] = prop[n];
            }
        }
    }

    function createElement(tag, prop) {
        var el = document.createElement(tag || 'div');
        applyCss(el, prop);
        return el;
    }

    function checkDirection(e, pos, sizeQ) {

        var pageX = e.pageX;
        var pageY = e.pageY;

        if (e.hasOwnProperty('touches')) {
            var touch = e.touches[0];
            pageX = touch.pageX;
            pageY = touch.pageY;
        }

        var fx = pos.x, fy = pos.y, tx = pageX - fx, ty = pageY - fy, direction;
        if (tx < sizeQ) direction = 0; // left
        else if (tx > sizeQ * 3) direction = 1; // right
        else if (ty < sizeQ) direction = 2; // top
        else direction = 3; // bottom
        return direction;
    }

    function checkPosition(e, pos, size) {

        var pageX = e.pageX;
        var pageY = e.pageY;

        if (e.hasOwnProperty('touches')) {
            var touch = e.touches[0];
            pageX = touch.pageX;
            pageY = touch.pageY;
        }

        var fx = pos.x, fy = pos.y, tx = pageX - fx, ty = pageY - fy, value,
            a = size - tx, b = size - ty, c = tx >> 1, d = ty >> 1, e = a >> 1, f = b >> 1;
        if (_direction == 0) {
            // left
            value = {
                bx: -size,
                by: 0,
                sx: -1,
                sy: 1,
                bs: 'shadowL',
                bmx: -size + tx,
                bmy: 0,
                bsw: tx,
                bsh: size,
                bsx: a,
                bsy: 0,
                cw: size - c,
                ch: size,
                cx: c,
                cy: 0,
                dw: c,
                dh: size,
                dx: c - (c >> 1),
                dy: 0
            };
        }
        else if (_direction == 1) {
            // right
            value = {
                bx: size,
                by: 0,
                sx: -1,
                sy: 1,
                bs: 'shadowR',
                bmx: tx,
                bmy: 0,
                bsw: a,
                bsh: size,
                bsx: 0,
                bsy: 0,
                cw: size - e,
                ch: size,
                cx: 0,
                cy: 0,
                dw: e,
                dh: size,
                dx: size - a + (e >> 1),
                dy: 0
            };
        }
        else if (_direction == 2) {
            // top
            value = {
                bx: 0,
                by: -size,
                sx: 1,
                sy: -1,
                bs: 'shadowT',
                bmx: 0,
                bmy: -size + ty,
                bsw: size,
                bsh: ty,
                bsx: 0,
                bsy: b,
                cw: size,
                ch: size - d,
                cx: 0,
                cy: d,
                dw: size,
                dh: d,
                dx: 0,
                dy: d - (d >> 1)
            };
        }
        else {
            // bottom
            value = {
                bx: 0,
                by: size,
                sx: 1,
                sy: -1,
                bs: 'shadowB',
                bmx: 0,
                bmy: ty,
                bsw: size,
                bsh: b,
                bsx: 0,
                bsy: 0,
                cw: size,
                ch: size - f,
                cx: 0,
                cy: 0,
                dw: size,
                dh: f,
                dx: 0,
                dy: size - b + (f >> 1)
            };
        }
        return value;
    }

    function onEnter(e, value) {
        var cpos = value.container.getBoundingClientRect(),
            mpos = {x: cpos.left + window.pageXOffset, y: cpos.top + window.pageYOffset};
        _direction = checkDirection(e, mpos, value.sizeQ);
        _savePos = checkPosition(e, mpos, value.size);
        _savePos.pos = mpos;
        var bx = _savePos.bx, by = _savePos.by, sx = _savePos.sx, sy = _savePos.sy, bs = _savePos.bs;
        value.backShadow.className = value.depth.className = 'sticker-shadow ' + bs;

        applyCss(value.mask, {
            transition: _setTrans,
            width: value.size + 'px',
            height: value.size + 'px',
            transform: 'translate3d(' + 0 + 'px, ' + 0 + 'px, 0)'
        });
        applyCss(value.move, {
            transition: _setTrans,
            transform: 'translate3d(' + 0 + 'px, ' + 0 + 'px, 0)'
        });
        applyCss(value.back, {
            transition: _setTrans,
            transform: 'translate3d(' + bx + 'px, ' + by + 'px, 0)'
        });
        applyCss(value.backImg, {
            transform: 'scaleX(' + sx + ') scaleY(' + sy + ')'
        });
        applyCss(value.depth, {
            transform: 'translate3d(' + -10000 + 'px, ' + -10000 + 'px, 0)'
        });
    }

    function onLeave(e, value) {
        if (_savePos == null) {
            return;
        }

        var bx = _savePos.bx, by = _savePos.by;

        applyCss(value.mask, {
            transition: _aniTrans,
            width: value.size + 'px',
            height: value.size + 'px',
            transform: 'translate3d(' + 0 + 'px, ' + 0 + 'px, 0)'
        });
        applyCss(value.move, {
            transition: _aniTrans,
            transform: 'translate3d(' + 0 + 'px, ' + 0 + 'px, 0)'
        });
        applyCss(value.back, {
            transition: _aniTrans,
            transform: 'translate3d(' + bx + 'px, ' + by + 'px, 0)'
        });
        applyCss(value.depth, {
            transform: 'translate3d(' + -10000 + 'px, ' + -10000 + 'px, 0)'
        });
        _savePos = null;
    }

    function onMove(e, value) {
        if (_savePos == null) {
            onEnter(e, value);
            window.document.addEventListener('mouseup', function (e) {
                this.removeEventListener('mouseup', arguments.callee, false);
                this.removeEventListener('touchend', arguments.callee, false);
                onLeave(e, value);
            }, false);
            window.document.addEventListener('touchend', function (e) {
                this.removeEventListener('mouseup', arguments.callee, false);
                this.removeEventListener('touchend', arguments.callee, false);
                onLeave(e, value);
            }, false);
        }
        var pos = checkPosition(e, _savePos.pos, value.size),
            bmx = pos.bmx, bmy = pos.bmy,
            bsw = pos.bsw, bsh = pos.bsh, bsx = pos.bsx, bsy = pos.bsy,
            cw = pos.cw, ch = pos.ch, cx = pos.cx, cy = pos.cy,
            dw = pos.dw, dh = pos.dh, dx = pos.dx, dy = pos.dy;
        applyCss(value.mask, {
            width: cw + 'px',
            height: ch + 'px',
            transform: 'translate3d(' + cx + 'px, ' + cy + 'px, 0)'
        });
        applyCss(value.move, {
            transform: 'translate3d(' + -cx + 'px, ' + -cy + 'px, 0)'
        });
        applyCss(value.back, {
            transform: 'translate3d(' + bmx + 'px, ' + bmy + 'px, 0)'
        });
        applyCss(value.backShadow, {
            width: bsw + 'px',
            height: bsh + 'px',
            transform: 'translate3d(' + bsx + 'px, ' + bsy + 'px, 0)'
        });
        applyCss(value.depth, {
            width: dw + 'px',
            height: dh + 'px',
            transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0)'
        });
    }

    var sticker = {

        /**
         * Attach to the given DOM element.
         * Register event listeners for mouse movement.
         *
         * @param {Element|string} dom
         */
        init: function init(dom) {
            if (typeof dom === 'string') {
                var item = document.querySelectorAll(dom), i, total = item.length;
                for (i = 0; i < total; i++) {
                    init(item[i]);
                }
                return;
            }

            var value,
                pos = dom.getBoundingClientRect(),
                size = pos.width,
                sizeQ = size >> 2,
                container = createElement('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                mask = createElement('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                move = createElement('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                front = createElement('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    zIndex: 1
                }),
                back = createElement('div', {
                    position: 'absolute',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 3,
                    backgroundColor: '#ffffff',
                    transform: 'translate3d(' + size + 'px, ' + 0 + 'px, 0)',
                    overflow: 'hidden'
                }),
                backImg = createElement('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    opacity: '0.4'
                }),
                backShadow = createElement('div', {
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 4
                }),
                depth = createElement('div', {
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 1
                });

            container.className = 'sticker-container';
            move.className = 'sticker-move';
            front.className = 'sticker-img sticker-front';
            back.className = 'sticker-img sticker-back2';
            backImg.className = 'sticker-img sticker-back';
            backShadow.className = depth.className = 'sticker-shadow';
            depth.className = depth.className = 'sticker-depth';

            // If "data-sticker-img" attribute is set, use that as the image
            if (typeof dom.dataset.stickerImg === 'string') {
                front.style.backgroundImage = 'url(' + dom.dataset.stickerImg + ')';
                backImg.style.backgroundImage = 'url(' + dom.dataset.stickerImg + ')';
            }

            dom.appendChild(container);
            container.appendChild(mask);
            mask.appendChild(move);
            move.appendChild(front);
            move.appendChild(depth);
            move.appendChild(back);
            back.appendChild(backImg);
            back.appendChild(backShadow);

            value = {
                container: container,
                size: size,
                sizeQ: sizeQ,
                mask: mask,
                move: move,
                depth: depth,
                back: back,
                backImg: backImg,
                backShadow: backShadow
            };

            var radius = pos.width / 2;
            circle = new SimpleCircle(0, 0, radius);
            console.log(circle);

            // Enter
            dom.addEventListener('mouseenter', function (e) {
                onEnter(e, value);
            }, false);
            dom.addEventListener('touchstart', function (e) {
                onEnter(e, value);
            }, false);

            // Leave
            dom.addEventListener('mouseleave', function (e) {
                onLeave(e, value);
            }, false);
            dom.addEventListener('touchend', function (e) {
                onLeave(e, value);
            }, false);

            // Move
            dom.addEventListener('mousemove', function (e) {
                onMove(e, value);
            }, false);
            dom.addEventListener('touchmove', function (e) {
                onMove(e, value);
            }, false);

            return this;
        }
    }

    /* CommonJS */
    if (typeof exports == 'object') module.exports = sticker;
    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(function () {
        return sticker
    });
    /* Browser global */
    else this.Sticker = sticker;
})();

