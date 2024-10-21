(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) : typeof define === 'function' && define.amd ? define(['jquery'], factory) : (global.clippy = factory(global.$));
}(this, (function ($) {
    'use strict';

    $ = 'default' in $ ? $['default'] : $;

    let Queue = function Queue(onEmptyCallback) {
        this._queue = [];
        this._onEmptyCallback = onEmptyCallback;
    };

    /***
     *
     * @param {function(Function)} func
     * @returns {jQuery.Deferred}
     */
    Queue.prototype.queue = function queue(func) {
        this._queue.push(func);

        if (this._queue.length === 1 && !this._active) {
            this._progressQueue();
        }
    };

    Queue.prototype._progressQueue = function _progressQueue() {

        // stop if nothing left in queue
        if (!this._queue.length) {
            this._onEmptyCallback();
            return;
        }

        let f = this._queue.shift();
        this._active = true;

        // execute function
        let completeFunction = $.proxy(this.next, this);
        f(completeFunction);
    };

    Queue.prototype.clear = function clear() {
        this._queue = [];
    };

    Queue.prototype.next = function next() {
        this._active = false;
        this._progressQueue();
    };

    let Animator = function Animator(el, path, data, sounds) {
        let this$1 = this;

        this._el = el;
        this._data = data;
        this._path = path;
        this._currentFrameIndex = 0;
        this._currentFrame = undefined;
        this._exiting = false;
        this._currentAnimation = undefined;
        this._endCallback = undefined;
        this._started = false;
        this._sounds = {};
        this.currentAnimationName = undefined;
        this.preloadSounds(sounds);
        this._overlays = [this._el];
        let curr = this._el;

        this._setupElement(this._el);
        for (let i = 1; i < this._data.overlayCount; i++) {
            let inner = this$1._setupElement($('<div></div>'));
            curr.append(inner);
            this$1._overlays.push(inner);
            curr = inner;
        }
    };

    Animator.prototype._setupElement = function _setupElement(el) {
        let frameSize = this._data.framesize;
        el.css('display', "none");
        el.css({width: frameSize[0], height: frameSize[1]});
        el.css('background', "url('" + this._path + "/map.png') no-repeat");

        return el;
    };

    Animator.prototype.animations = function animations() {
        let r = [];
        let d = this._data.animations;
        for (let n in d) {
            r.push(n);
        }
        return r;
    };

    Animator.prototype.preloadSounds = function preloadSounds(sounds) {
        let this$1 = this;


        for (let i = 0; i < this._data.sounds.length; i++) {
            let snd = this$1._data.sounds[i];
            let uri = sounds[snd];
            if (!uri) {
                continue;
            }
            this$1._sounds[snd] = new Audio(uri);

        }
    };

    Animator.prototype.hasAnimation = function hasAnimation(name) {
        return !!this._data.animations[name];
    };

    Animator.prototype.exitAnimation = function exitAnimation() {
        this._exiting = true;
    };

    Animator.prototype.showAnimation = function showAnimation(animationName, stateChangeCallback) {
        this._exiting = false;

        if (!this.hasAnimation(animationName)) {
            return false;
        }

        this._currentAnimation = this._data.animations[animationName];
        this.currentAnimationName = animationName;


        if (!this._started) {
            this._step();
            this._started = true;
        }

        this._currentFrameIndex = 0;
        this._currentFrame = undefined;
        this._endCallback = stateChangeCallback;

        return true;
    };

    Animator.prototype._draw = function _draw() {
        let this$1 = this;

        let images = [];
        if (this._currentFrame) {
            images = this._currentFrame.images || [];
        }

        for (let i = 0; i < this._overlays.length; i++) {
            if (i < images.length) {
                let xy = images[i];
                let bg = -xy[0] + 'px ' + -xy[1] + 'px';
                this$1._overlays[i].css({'background-position': bg, 'display': 'block'});
            } else {
                this$1._overlays[i].css('display', 'none');
            }

        }
    };

    Animator.prototype._getNextAnimationFrame = function _getNextAnimationFrame() {
        if (!this._currentAnimation) {
            return undefined;
        }
        // No current frame. start animation.
        if (!this._currentFrame) {
            return 0;
        }
        let currentFrame = this._currentFrame;
        let branching = this._currentFrame.branching;


        if (this._exiting && currentFrame.exitBranch !== undefined) {
            return currentFrame.exitBranch;
        } else if (branching) {
            let rnd = Math.random() * 100;
            for (let i = 0; i < branching.branches.length; i++) {
                let branch = branching.branches[i];
                if (rnd <= branch.weight) {
                    return branch.frameIndex;
                }

                rnd -= branch.weight;
            }
        }

        return this._currentFrameIndex + 1;
    };


    Animator.prototype._playSound = function _playSound() {
        let s = this._currentFrame.sound;
        if (!s) {
            return;
        }
        let audio = this._sounds[s];
        if (audio) {
            audio.play();
        }
    };

    Animator.prototype._atLastFrame = function _atLastFrame() {
        return this._currentFrameIndex >= this._currentAnimation.frames.length - 1;
    };


    Animator.prototype._step = function _step() {
        if (!this._currentAnimation) {
            return;
        }
        let newFrameIndex = Math.min(this._getNextAnimationFrame(), this._currentAnimation.frames.length - 1);
        let frameChanged = !this._currentFrame || this._currentFrameIndex !== newFrameIndex;
        this._currentFrameIndex = newFrameIndex;

        // always switch frame data, unless we're at the last frame of an animation with a useExitBranching flag.
        if (!(this._atLastFrame() && this._currentAnimation.useExitBranching)) {
            this._currentFrame = this._currentAnimation.frames[this._currentFrameIndex];
        }

        this._draw();
        this._playSound();

        this._loop = window.setTimeout($.proxy(this._step, this), this._currentFrame.duration);


        // fire events if the frames changed and we reached an end
        if (this._endCallback && frameChanged && this._atLastFrame()) {
            if (this._currentAnimation.useExitBranching && !this._exiting) {
                this._endCallback(this.currentAnimationName, Animator.States.WAITING);
            } else {
                this._endCallback(this.currentAnimationName, Animator.States.EXITED);
            }
        }
    };

    /***
     * Pause animation execution
     */
    Animator.prototype.pause = function pause() {
        window.clearTimeout(this._loop);
    };

    /***
     * Resume animation
     */
    Animator.prototype.resume = function resume() {
        this._step();
    };

    Animator.States = {WAITING: 1, EXITED: 0};

    let Balloon = function Balloon(targetEl) {
        this._targetEl = targetEl;

        this._hidden = true;
        this._setup();
        this.WORD_SPEAK_TIME = 200;
        this.CLOSE_BALLOON_DELAY = 2000;
        this._BALLOON_MARGIN = 15;
    };

    Balloon.prototype._setup = function _setup() {

        this._balloon = $('<div class="clippy-balloon"><div class="clippy-tip"></div><div class="clippy-content"></div></div> ').hide();
        this._content = this._balloon.find('.clippy-content');

        $(document.querySelector("clippy")).append(this._balloon);
    };

    Balloon.prototype.reposition = function reposition() {
        let this$1 = this;

        let sides = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

        for (let i = 0; i < sides.length; i++) {
            let s = sides[i];
            this$1._position(s);
            if (!this$1._isOut()) {
                break;
            }
        }
    };

    /***
     *
     * @param side
     * @private
     */
    Balloon.prototype._position = function _position(side) {
        let o = this._targetEl.offset();
        let h = this._targetEl.height();
        let w = this._targetEl.width();
        o.top -= $(window).scrollTop();
        o.left -= $(window).scrollLeft();

        let bH = this._balloon.outerHeight();
        let bW = this._balloon.outerWidth();

        this._balloon.removeClass('clippy-top-left');
        this._balloon.removeClass('clippy-top-right');
        this._balloon.removeClass('clippy-bottom-right');
        this._balloon.removeClass('clippy-bottom-left');

        let left, top;
        switch (side) {
            case 'top-left':
                // right side of the balloon next to the right side of the agent
                left = o.left + w - bW;
                top = o.top - bH - this._BALLOON_MARGIN;
                break;
            case 'top-right':
                // left side of the balloon next to the left side of the agent
                left = o.left;
                top = o.top - bH - this._BALLOON_MARGIN;
                break;
            case 'bottom-right':
                // right side of the balloon next to the right side of the agent
                left = o.left;
                top = o.top + h + this._BALLOON_MARGIN;
                break;
            case 'bottom-left':
                // left side of the balloon next to the left side of the agent
                left = o.left + w - bW;
                top = o.top + h + this._BALLOON_MARGIN;
                break;
        }

        this._balloon.css({top: top, left: left});
        this._balloon.addClass('clippy-' + side);
    };

    Balloon.prototype._isOut = function _isOut() {
        let o = this._balloon.offset();
        let bH = this._balloon.outerHeight();
        let bW = this._balloon.outerWidth();

        let wW = $(window).width();
        let wH = $(window).height();
        let sT = $(document).scrollTop();
        let sL = $(document).scrollLeft();

        let top = o.top - sT;
        let left = o.left - sL;
        let m = 5;
        if (top - m < 0 || left - m < 0) {
            return true;
        }
        return (top + bH + m) > wH || (left + bW + m) > wW;
    };

    Balloon.prototype.speak = function speak(complete, text, hold) {
        this._hidden = false;
        this.show();
        let c = this._content;
        // set height to auto
        c.height('auto');
        c.width('auto');
        // add the text
        c.text(text);
        // set height
        c.height(c.height());
        c.width(c.width());
        c.text('');
        this.reposition();

        this._complete = complete;
        this._sayWords(text, hold, complete);
    };

    Balloon.prototype.show = function show() {
        if (this._hidden) {
            return;
        }
        this._balloon.show();
    };

    Balloon.prototype.hide = function hide(fast) {
        if (fast) {
            this._balloon.hide();
            return;
        }

        this._hiding = window.setTimeout($.proxy(this._finishHideBalloon, this), this.CLOSE_BALLOON_DELAY);
    };

    Balloon.prototype._finishHideBalloon = function _finishHideBalloon() {
        if (this._active) {
            return;
        }
        this._balloon.hide();
        this._hidden = true;
        this._hiding = null;
    };

    Balloon.prototype._sayWords = function _sayWords(text, hold, complete) {
        this._active = true;
        this._hold = hold;
        let words = text.split(/[^\S-]/);
        let time = this.WORD_SPEAK_TIME;
        let el = this._content;
        let idx = 1;


        this._addWord = $.proxy(function () {
            if (!this._active) {
                return;
            }
            if (idx > words.length) {
                delete this._addWord;
                this._active = false;
                if (!this._hold) {
                    complete();
                    this.hide();
                }
            } else {
                el.text(words.slice(0, idx).join(' '));
                idx++;
                this._loop = window.setTimeout($.proxy(this._addWord, this), time);
            }
        }, this);

        this._addWord();

    };

    Balloon.prototype.close = function close() {
        if (this._active) {
            this._hold = false;
        } else if (this._hold) {
            this._complete();
        }
    };

    Balloon.prototype.pause = function pause() {
        window.clearTimeout(this._loop);
        if (this._hiding) {
            window.clearTimeout(this._hiding);
            this._hiding = null;
        }
    };

    Balloon.prototype.resume = function resume() {
        if (this._addWord) {
            this._addWord();
        } else if (!this._hold && !this._hidden) {
            this._hiding = window.setTimeout($.proxy(this._finishHideBalloon, this), this.CLOSE_BALLOON_DELAY);
        }
    };

    let Agent = function Agent(path, data, sounds) {
        this.path = path;

        this._queue = new Queue($.proxy(this._onQueueEmpty, this));

        this._el = $('<div class="clippy"></div>').hide();

        $(document.querySelector("clippy")).append(this._el);

        this._animator = new Animator(this._el, path, data, sounds);

        this._balloon = new Balloon(this._el);

        this._setupEvents();
    };

    /***
     *
     * @param {Number} x
     * @param {Number} y
     */
    Agent.prototype.gestureAt = function gestureAt(x, y) {
        let d = this._getDirection(x, y);
        let gAnim = 'Gesture' + d;
        let lookAnim = 'Look' + d;

        let animation = this.hasAnimation(gAnim) ? gAnim : lookAnim;
        return this.play(animation);
    };

    /***
     *
     * @param {Boolean=} fast
     *
     */
    Agent.prototype.hide = function hide(fast, callback) {
        this._hidden = true;
        let el = this._el;
        this.stop();
        if (fast) {
            this._el.hide();
            this.stop();
            this.pause();
            if (callback) {
                callback();
            }
            return;
        }

        return this._playInternal('GoodBye', function () {
            el.hide();
            this.pause();
            if (callback) {
                callback();
            }
        })
    };


    Agent.prototype.moveTo = function moveTo(x, y, duration) {
        let dir = this._getDirection(x, y);
        let anim = 'Move' + dir;
        if (duration === undefined) {
            duration = 1000;
        }

        this._addToQueue(function (complete) {
            // the simple case
            if (duration === 0) {
                this._el.css({top: y, left: x});
                this.reposition();
                complete();
                return;
            }

            // no animations
            if (!this.hasAnimation(anim)) {
                this._el.animate({top: y, left: x}, duration, complete);
                return;
            }

            let callback = $.proxy(function (name, state) {
                // when exited, complete
                if (state === Animator.States.EXITED) {
                    complete();
                }
                // if waiting,
                if (state === Animator.States.WAITING) {
                    this._el.animate({top: y, left: x}, duration, $.proxy(function () {
                        // after we're done with the movement, do the exit animation
                        this._animator.exitAnimation();
                    }, this));
                }

            }, this);

            this._playInternal(anim, callback);
        }, this);
    };

    Agent.prototype._playInternal = function _playInternal(animation, callback) {

        // if we're inside an idle animation,
        if (this._isIdleAnimation() && this._idleDfd && this._idleDfd.state() === 'pending') {
            this._idleDfd.done($.proxy(function () {
                this._playInternal(animation, callback);
            }, this));
        }

        this._animator.showAnimation(animation, callback);
    };

    Agent.prototype.play = function play(animation, timeout, cb) {
        if (!this.hasAnimation(animation)) {
            return false;
        }

        if (timeout === undefined) {
            timeout = 5000;
        }


        this._addToQueue(function (complete) {
            let completed = false;
            // handle callback
            let callback = function (name, state) {
                if (state === Animator.States.EXITED) {
                    completed = true;
                    if (cb) {
                        cb();
                    }
                    complete();
                }
            };

            // if function has timeout, register a timeout function
            if (timeout) {
                window.setTimeout($.proxy(function () {
                    if (completed) {
                        return;
                    }
                    // exit after timeout
                    this._animator.exitAnimation();
                }, this), timeout);
            }

            this._playInternal(animation, callback);
        }, this);

        return true;
    };

    /***
     *
     * @param {Boolean=} fast
     */
    Agent.prototype.show = function show(fast) {

        this._hidden = false;
        if (fast) {
            this._el.show();
            this.resume();
            this._onQueueEmpty();
            return;
        }

        if (this._el.css('top') === 'auto' || !this._el.css('left') === 'auto') {
            let left = $(window).width() * 0.6;
            let top = ($(window).height() + $(document).scrollTop()) * 0.8;
            this._el.css({top: top, left: left});
        }

        this.resume();
        return this.play('Greeting');
    };

    /***
     *
     * @param {String} text
     * @param hold
     */
    Agent.prototype.speak = function speak(text, hold) {
        this._addToQueue(function (complete) {
            this._balloon.speak(complete, text, hold);
        }, this);
    };


    /***
     * Close the current balloon
     */
    Agent.prototype.closeBalloon = function closeBalloon() {
        this._balloon.hide();
    };

    Agent.prototype.delay = function delay(time) {
        time = time || 250;

        this._addToQueue(function (complete) {
            this._onQueueEmpty();
            window.setTimeout(complete, time);
        });
    };

    /***
     * Skips the current animation
     */
    Agent.prototype.stopCurrent = function stopCurrent() {
        this._animator.exitAnimation();
        this._balloon.close();
    };


    Agent.prototype.stop = function stop() {
        // clear the queue
        this._queue.clear();
        this._animator.exitAnimation();
        this._balloon.hide();
    };

    /***
     *
     * @param {String} name
     * @returns {Boolean}
     */
    Agent.prototype.hasAnimation = function hasAnimation(name) {
        return this._animator.hasAnimation(name);
    };

    /***
     * Gets a list of animation names
     *
     * @return {Array.<string>}
     */
    Agent.prototype.animations = function animations() {
        return this._animator.animations();
    };

    /***
     * Play a random animation
     * @return {jQuery.Deferred}
     */
    Agent.prototype.animate = function animate() {
        let animations = this.animations();
        let anim = animations[Math.floor(Math.random() * animations.length)];
        // skip idle animations
        if (anim.indexOf('Idle') === 0) {
            return this.animate();
        }
        return this.play(anim);
    };

    /**************************** Utils ************************************/

    /***
     *
     * @param {Number} x
     * @param {Number} y
     * @return {String}
     * @private
     */
    Agent.prototype._getDirection = function _getDirection(x, y) {
        let offset = this._el.offset();
        let h = this._el.height();
        let w = this._el.width();

        let centerX = (offset.left + w / 2);
        let centerY = (offset.top + h / 2);


        let a = centerY - y;
        let b = centerX - x;

        let r = Math.round((180 * Math.atan2(a, b)) / Math.PI);

        // Left and Right are for the character, not the screen :-/
        if (-45 <= r && r < 45) {
            return 'Right';
        }
        if (45 <= r && r < 135) {
            return 'Up';
        }
        if (135 <= r && r <= 180 || -180 <= r && r < -135) {
            return 'Left';
        }
        if (-135 <= r && r < -45) {
            return 'Down';
        }

        // sanity check
        return 'Top';
    };

    /**************************** Queue and Idle handling ************************************/

    /***
     * Handle empty queue.
     * We need to transition the animation to an idle state
     * @private
     */
    Agent.prototype._onQueueEmpty = function _onQueueEmpty() {
        if (this._hidden || this._isIdleAnimation()) {
            return;
        }
        let idleAnim = this._getIdleAnimation();
        this._idleDfd = $.Deferred();

        this._animator.showAnimation(idleAnim, $.proxy(this._onIdleComplete, this));
    };

    Agent.prototype._onIdleComplete = function _onIdleComplete(name, state) {
        if (state === Animator.States.EXITED) {
            this._idleDfd.resolve();
        }
    };

    /***
     * Is the current animation is Idle?
     * @return {Boolean}
     * @private
     */
    Agent.prototype._isIdleAnimation = function _isIdleAnimation() {
        let c = this._animator.currentAnimationName;
        return c && c.indexOf('Idle') === 0;
    };


    /**
     * Gets a random Idle animation
     * @return {String}
     * @private
     */
    Agent.prototype._getIdleAnimation = function _getIdleAnimation() {
        let animations = this.animations();
        let r = [];
        for (let i = 0; i < animations.length; i++) {
            let a = animations[i];
            if (a.indexOf('Idle') === 0) {
                r.push(a);
            }
        }

        // pick one
        let idx = Math.floor(Math.random() * r.length);
        return r[idx];
    };

    /**************************** Events ************************************/

    Agent.prototype._setupEvents = function _setupEvents() {
        $(window).on('resize', $.proxy(this.reposition, this));

        this._el.on('mousedown', $.proxy(this._onMouseDown, this));
    };

    Agent.prototype.reposition = function reposition() {
        if (!this._el.is(':visible')) {
            return;
        }
        let o = this._el.offset();
        let bH = this._el.outerHeight();
        let bW = this._el.outerWidth();

        let wW = $(window).width();
        let wH = $(window).height();
        let sT = $(window).scrollTop();
        let sL = $(window).scrollLeft();

        let top = o.top - sT;
        let left = o.left - sL;
        let m = 5;
        if (top - m < 0) {
            top = m;
        } else if ((top + bH + m) > wH) {
            top = wH - bH - m;
        }

        if (left - m < 0) {
            left = m;
        } else if (left + bW + m > wW) {
            left = wW - bW - m;
        }

        this._el.css({left: left, top: top});
        // reposition balloon
        this._balloon.reposition();
    };

    Agent.prototype._onMouseDown = function _onMouseDown(e) {
        if (e.button !== 2) {
            e.preventDefault();
            this._startDrag(e);
        }
    };


    /**************************** Drag ************************************/

    Agent.prototype._startDrag = function _startDrag(e) {
        // pause animations
        //this.pause();
        this._balloon.hide(true);
        this._offset = this._calculateClickOffset(e);

        this._moveHandle = $.proxy(this._dragMove, this);
        this._upHandle = $.proxy(this._finishDrag, this);

        $(window).on('mousemove', this._moveHandle);
        $(window).on('mouseup', this._upHandle);

        this._dragUpdateLoop = window.setTimeout($.proxy(this._updateLocation, this), 10);
    };

    Agent.prototype._calculateClickOffset = function _calculateClickOffset(e) {
        let mouseX = e.pageX;
        let mouseY = e.pageY;
        let o = this._el.offset();
        return {
            top: mouseY - o.top, left: mouseX - o.left
        }

    };

    Agent.prototype._updateLocation = function _updateLocation() {
        this._el.css({top: this._targetY, left: this._targetX});
        this._dragUpdateLoop = window.setTimeout($.proxy(this._updateLocation, this), 10);
    };

    Agent.prototype._dragMove = function _dragMove(e) {
        e.preventDefault();
        let x = e.clientX - this._offset.left;
        let y = e.clientY - this._offset.top;
        this._targetX = x;
        this._targetY = y;
    };

    Agent.prototype._finishDrag = function _finishDrag() {
        window.clearTimeout(this._dragUpdateLoop);
        // remove handles
        $(window).off('mousemove', this._moveHandle);
        $(window).off('mouseup', this._upHandle);
        // resume animations
        this._balloon.show();
        this.reposition();
        //this.resume();

    };

    Agent.prototype._addToQueue = function _addToQueue(func, scope) {
        if (scope) {
            func = $.proxy(func, scope);
        }
        this._queue.queue(func);
    };

    /**************************** Pause and Resume ************************************/

    Agent.prototype.pause = function pause() {
        this._animator.pause();
        this._balloon.pause();

    };

    Agent.prototype.resume = function resume() {
        this._animator.resume();
        this._balloon.resume();
    };

    const load = function load(name, successCb, failCb, base_path) {
        base_path = base_path || window.CLIPPY_CDN || '//cdn.croomssched.tech/data/a686c29b-4479-45e8-870f-077f6ec47c5f/assets/agents/';

        let path = base_path + name;
        let mapDfd = load._loadMap(path);
        let agentDfd = load._loadAgent(name, path);
        let soundsDfd = load._loadSounds(name, path);

        let data;
        agentDfd.done(function (d) {
            data = d;
        });

        let sounds;

        soundsDfd.done(function (d) {
            sounds = d;
        });

        // wrapper to the success callback
        let cb = function () {
            let a = new Agent(path, data, sounds);
            successCb(a);
        };

        $.when(mapDfd, agentDfd, soundsDfd).done(cb).fail(failCb);
    };

    load._loadMap = function _loadMap(path) {
        let dfd = load._maps[path];
        if (dfd) {
            return dfd;
        }

        // set dfd if not defined
        dfd = load._maps[path] = $.Deferred();

        let src = path + '/map.png';
        let img = new Image();

        img.onload = dfd.resolve;
        img.onerror = dfd.reject;

        // start loading the map;
        img.setAttribute('src', src);

        return dfd.promise();
    };

    load._loadSounds = function _loadSounds(name, path) {
        let dfd = load._sounds[name];
        if (dfd) {
            return dfd;
        }

        // set dfd if not defined
        dfd = load._sounds[name] = $.Deferred();

        let audio = document.createElement('audio');
        let canPlayMp3 = !!audio.canPlayType && "" !== audio.canPlayType('audio/mpeg');
        let canPlayOgg = !!audio.canPlayType && "" !== audio.canPlayType('audio/ogg; codecs="vorbis"');

        if (!canPlayMp3 && !canPlayOgg) {
            dfd.resolve({});
        } else {
            let src = path + (canPlayMp3 ? '/sounds-mp3.js' : '/sounds-ogg.js');
            // load
            load._loadScript(src);
        }

        return dfd.promise()
    };

    load._loadAgent = function _loadAgent(name, path) {
        let dfd = load._data[name];
        if (dfd) {
            return dfd;
        }

        dfd = load._getAgentDfd(name);

        let src = path + '/agent.js';

        load._loadScript(src);

        return dfd.promise();
    };

    load._loadScript = function _loadScript(src) {
        let script = document.createElement('script');
        script.setAttribute('src', src);
        script.setAttribute('async', 'async');
        script.setAttribute('type', 'text/javascript');

        document.head.appendChild(script);
    };

    load._getAgentDfd = function _getAgentDfd(name) {
        let dfd = load._data[name];
        if (!dfd) {
            dfd = load._data[name] = $.Deferred();
        }
        return dfd;
    };

    load._maps = {};
    load._sounds = {};
    load._data = {};

    function ready(name, data) {
        let dfd = load._getAgentDfd(name);
        dfd.resolve(data);
    }

    function soundsReady(name, data) {
        let dfd = load._sounds[name];
        if (!dfd) {
            dfd = load._sounds[name] = $.Deferred();
        }

        dfd.resolve(data);
    }

    let clippy = {
        Agent: Agent,
        Animator: Animator,
        Queue: Queue,
        Balloon: Balloon,
        load: load,
        ready: ready,
        soundsReady: soundsReady
    };

    if (typeof window !== 'undefined') {
        window.clippy = clippy;
    }

    return clippy;

})));

let firstLoad = window.localStorage.getItem("firstClippy");

let clippyAgent;

window.addEventListener("load", () => {
    clippy.load('Clippy', function(agent) {
        clippyAgent = agent;
        if (Settings.clippy === true) {
            agent.show();
            agent.play("greeting");
            if (firstLoad !== "false") {
                agent.speak("Hello! I am Clippy, your personal assistant. It's so nice to meet you!");
                window.localStorage.setItem("firstClippy", "false");
            }

            setUpClippyContextMenu();
        }
    });
});