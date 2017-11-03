/*
* jQuery Hotkeys Extended Plugin
* Copyright 2012, Jesse Buesking
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* Based upon the plugin by John Resig...
* https://github.com/jeresig/jquery.hotkeys
*
* ... which was based upon the plugin by Tzury Bar Yochay:
* http://github.com/tzuryby/hotkeys
*
* Original idea by:
* Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function ($)
{
    $.hotkeys = {
        version: '0.8',

        specialKeys: {
            8: 'backspace', 9: 'tab', 13: 'return', 16: 'shift', 17: 'ctrl', 18: 'alt', 19: 'pause',
            20: 'capslock', 27: 'esc', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home',
            37: 'left', 38: 'up', 39: 'right', 40: 'down', 45: 'insert', 46: 'del',
            96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7',
            104: '8', 105: '9', 106: '*', 107: '+', 109: '-', 110: '.', 111: '/',
            112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8',
            120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12', 144: 'numlock', 145: 'scroll', 191: '/', 224: 'meta'
        },

        shiftNums: {
            '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&',
            '8': '*', '9': '(', '0': ')', '-': '_', '=': '+', ';': ': ', "'": '\'', ',': '<',
            '.': '>', '/': '?', '\\': '|'
        },

        textAcceptingInputTypes: ['text', 'password', 'number', 'email', 'url', 'range', 'date', 'month', 'week', 'time', 'datetime', 'datetime-local', 'search', 'color'],

        isInput: function (t, e)
        {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if (t !== e.target && (/textarea|select/i.test(e.target.nodeName) ||
                $.inArray(e.target.type, $.hotkeys.textAcceptingInputTypes) > -1))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };

    // how far our key history should go back
    var n = 10,

    // cache to hold our key history
        lastKeys = [],

    // hotkeys settings
        settings = {

            // the event the following key binding(s) should be applied to
            keyEvent: 'keydown',

            // whether the following event(s) should return false (stop propagation)
            returnFalse: true
        };

    // catch and store EVERY key press for our history cache (so key combos are possible)
    $(document).on('keydown', function (e)
    {
        var code,
            special,
            character,
            modif = '',
            possible = [];

        if ($.hotkeys.isInput(this, e))
        {
            return;
        }

        code = (e.keyCode ? e.keyCode : e.which);
        special = e.type !== 'keypress' && jQuery.hotkeys.specialKeys[code];
        character = String.fromCharCode(code).toLowerCase();

        // check combinations (alt|ctrl|shift+anything)
        if (e.altKey && special !== 'alt')
        {
            modif += 'alt+';
        }

        if (e.ctrlKey && special !== 'ctrl')
        {
            modif += 'ctrl+';
        }

        // TODO: Need to make sure this works consistently across platforms
        if (e.metaKey && !e.ctrlKey && special !== 'meta')
        {
            modif += 'meta+';
        }

        if (e.shiftKey && special !== 'shift')
        {
            modif += 'shift+';
        }

        if (special)
        {
            possible.push(modif + special);
        }
        else
        {
            if (character)
            {
                possible.push(modif + character);
            }

            if ($.hotkeys.shiftNums[character])
            {
                possible.push(modif + $.hotkeys.shiftNums[character]);
            }

            // not working -> shift+/ as a character is 3/4, which is not in the shiftNums above (at least in chrome)
            // '$' can be triggered as 'Shift+4' or 'Shift+$' or just '$'
            if (modif === 'shift+' && $.hotkeys.shiftNums[character])
            {
                possible.push($.hotkeys.shiftNums[character]);
            }
        }

        lastKeys.push(possible);

        // clearing our cache if it's grown beyond the max threshold
        if (lastKeys.length > n)
        {
            lastKeys.shift();
        }
    });

    function keyHandler(handleObj)
    {
        // Only care when a possible input has been specified
        if (typeof handleObj.data !== 'string')
        {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(' ');

        handleObj.handler = function (e)
        {
            var possible;

            if ($.hotkeys.isInput(this, e))
            {
                return;
            }

            possible = lastKeys[lastKeys.length - 1];

            for (var i = 0, l = keys.length; i < l; i++)
            {
                for (var j = 0, le = possible.length; j < le; ++j)
                {
                    if (possible[j] === keys[i])
                    {
                        return origHandler.apply(this, arguments);
                    }
                }
            }
        };
    }

    $.each(['keydown', 'keyup', 'keypress'], function ()
    {
        $.event.special[this] = { add: keyHandler };
    });

    // method for doing key combination callbacks
    $.fn.hotkeys = function ()
    {
        var args = Array.prototype.slice.call(arguments),
            len = 0,
            callback = null;

        // initializing hotkeys
        if (typeof args[0] === 'object')
        {
            $.extend(settings, args[0]);
        }

        // binding keys
        else
        {
            if (args.length < 1)
            {
                $.error('must supply a callback method');
                return;
            }

            args = Array.prototype.reverse.call(args);

            // setting our callback and removing it
            callback = args.shift();

            // setting the length
            len = args.length;

            if (typeof callback !== 'function')
            {
                $.error('callback is not a valid function');
                return;
            }

            if (len < 1)
            {
                $.error('must specify at least one key to press');
                return;
            }

            this.bind(settings.keyEvent, args[0], function (e) // using jquery.hotkeys to bind the key (or combo) event to the function supplied
            {
                var lkl = lastKeys.length,
                    possible,
                    noMatch = true;

                if ($.hotkeys.isInput(this, e))
                {
                    return;
                }

                // starting at 1 b/c we already know that 0 is true (it triggered this call!)
                for (var i = 1; i < len; ++i)
                {
                    // (i + 1) b/c the current key (args[0]) has already been stored in lastKeys and is the last element on the stack
                    possible = lastKeys[lkl - (i + 1)];
                    noMatch = true;

                    for (var j = 0, l = possible.length; j < l; ++j)
                    {
                        if (possible[j] === args[i])
                        {
                            noMatch = false;
                            break;
                        }
                    }

                    if (noMatch)
                    {
                        return;
                    }
                }

                // if everything matched, call the method we supplied!
                callback();

                if (settings.returnFalse)
                {
                    return false;
                }
            });
        }

        // returning myself so I can chain my methods
        return this;
    };

})(jQuery);