// ==UserScript==
// @name            miaouBot
// @author          SteamWind
// @version         0.1
// @run-at          document-end
// ==/UserScript==


var flipTable = {
    "a": "\u0250",
    "à": "\u0250",
    "b": "q",
    "c": "\u0254",
    "ç": "\u0254",
    "d": "p",
    "e": "\u01DD",
    "é": "\u01DD",
    "è": "\u01DD",
    "ê": "\u01DD",
    "f": "\u025F",
    "g": "\u0183",
    "h": "\u0265",
    "i": "\u1D09",
    "j": "\u027E",
    "k": "\u029E",
    "m": "\u026F",
    "n": "u",
    "p": "d",
    "q": "b",
    "r": "\u0279",
    "t": "\u0287",
    "u": "n",
    "v": "\u028C",
    "w": "\u028D",
    "y": "\u028E",
    "z": "z",
    "A": "\u2200",
    "À": "\u2200",
    "C": "\u0186",
    "Ç": "\u0186",
    "E": "\u018E",
    "Ê": "\u018E",
    "È": "\u018E",
    "É": "\u018E",
    "F": "\u2132",
    "G": "\u05E4",
    "H": "H",
    "I": "I",
    "J": "\u017F",
    "L": "\u02E5",
    "M": "W",
    "N": "N",
    "P": "\u0500",
    "T": "\u2534",
    "U": "\u2229",
    "V": "\u039B",
    "Y": "\u2144",
    "1": "\u0196",
    "2": "\u1105",
    "3": "\u0190",
    "4": "\u3123",
    "5": "\u03DB",
    "6": "9",
    "7": "\u3125",
    "8": "8",
    "9": "6",
    ".": "\u02D9",
    ",": "'",
    "'": ",",
    '"': ",,",
    "`": ",",
    "?": "\u00BF",
    "!": "\u00A1",
    "[": "]",
    "]": "[",
    "(": ")",
    ")": "(",
    "{": "}",
    "}": "{",
    "<": ">",
    ">": "<",
    "&": "\u214B",
    "_": "\u203E",
    "\u2234": "\u2235",
    "\u2045": "\u2046"
};

var fancy = false;
var pingBack = false;
var afk = false;
var afkMessage = "";

var code = function () {

    if (!miaou || !miaou.chat) return;


    var IAmPingedRegex = new RegExp('@' + me.name + '(\\b|$)');
    // when a message comes in, let's handle it
    miaou.chat.on('incoming_message', function (m) {
        if (!(m.created > miaou.chat.enterTime)) return; // we only handle new messages
        if (IAmPingedRegex.test(m.content) && m.author !== me.id && pingBack) {
            // we've been pinged, let's pong, maybe
            var delay = 5000 * Math.random();
            if (delay > 2000) setTimeout(function () {
                miaou.chat.sendMessage("@" + m.authorname + "#" + m.id + " " + (~m.content.indexOf("pong") ? "ping" : "pong!"));
            }, delay);
        } else if (IAmPingedRegex.test(m.content) && m.author !== me.id && afk) {
            miaou.chat.sendMessage("@" + m.authorname + "#" + m.id + " " + "AFK: " + afkMessage);
        } else if (/^echo [^\n]+$/.test(m.content)) {
            // somebody wants us to repeat, let's do it
            miaou.chat.sendMessage(m.authorname + " says\n> " + m.content.slice("echo ".length));
        }
    });

    var deco = ['', '*', '**', '***', '---', '`', ' '];
    // when a message is sent by the host user, let's make it prettier
    miaou.chat.on('sending_message', function (m) {
        if (/!@all/.test(m.content)) {
            var allUserArray = $('#users .user').map(function () {
                return $(this).data('user').name
            }).get().filter(function (n) {
                    return n !== me.name
            });
            allUserArray.forEach(function (user, index) {
                allUserArray[index] = "@" + user;
            });
            var allUsers = allUserArray.join(", ");
            m.content = m.content.replace("!@all", allUsers);
        }
        if (/^[\-*`]*flip[\-*`]* [^\n`*\/]*$/.test(m.content)) {
            m.content = flipString(m.content.slice("flip ".length));
        } else if (/^[\-*`]*yoda[\-*`]* [^\n`*\/]*$/.test(m.content)) {
            m.content = yoda(m.content.slice("yoda ".length));
        } else if (/^[\-*`]*afk[\-*`]* [^\n`*\/]*$/.test(m.content)) {
            afkMessage = m.content.slice("afk ".length);
            afk = true;
            console.log("AFK: " + afkMessage);
        } else if (/^[\-*`]*afk[\-*`]*/.test(m.content)) {
            afkMessage = "";
            afk = false;
            console.log("Back from AFK");
            m.content = "I'm back.";
        } else if (/^[\-*`]*fancy[\-*`]*/.test(m.content)) {
            fancy = !fancy;
            var fancyActivated = fancy ? "activated" : "disabled";
            console.log("Fancy mode " + fancyActivated);
            alert("Fancy mode " + fancyActivated);
            return false;
        } else if (/^[\-*`]*pingback[\-*`]*/.test(m.content)) {
            pingBack = !pingBack;
            var pingBackActivated = pingBack ? "activated" : "disabled";
            console.log("PingBack mode " + pingBackActivated);
            alert("PingBack mode " + pingBackActivated);
            return false;
        } else if (/^\w[^\n`*\/]*$/.test(m.content) && fancy) {
            m.content = m.content.split(' ').map(function (t, b) {
                return b = deco[~~(Math.random() * deco.length)], b + t + b;
            }).join(' ');
        } else {
//            m.content = m.content;
        }
    });

    // Now... Please test your bots in room where you won't disturb everybody ^^
}

var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);


function flipString(aString) {
    var last = aString.length - 1;
    var result = "";
    for (var i = last; i >= 0; --i) {
        result += !!flipTable[aString.charAt(i)] ? flipTable[aString.charAt(i)] : aString.charAt(i)
    }
    return result;
}

function yoda(aString) {
    String.prototype.splice = function (idx, rem, s) {
        return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };
    var stringSentences = "";
    var arraySentences = aString.split(/[.?!]/).filter(Boolean);
    var tableChar = [];
    [].forEach.call(aString, function (v, i) {
        if (/[.?!]/.test(v)) tableChar.push({"index": i, "char": v})
    });
    arraySentences.forEach(function (sentence) {
        sentence = sentence.split(" ").sort(function () {
            return Math.random() < 0.5
        }).join(" ");
        sentence = sentence.toLowerCase();
        sentence = sentence.charAt(0).toUpperCase() + sentence.substring(1);
        stringSentences = stringSentences + sentence;
    });
    tableChar.forEach(function (entry) {
        stringSentences = stringSentences.splice(entry["index"], 0, entry["char"]);
    });
    console.log(stringSentences);
    return stringSentences;
}

console.info("miaouBot activated!");