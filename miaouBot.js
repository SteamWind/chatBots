// ==UserScript==
// @namespace		http://dystroy.org/miaou
// @name            MiaouBotSample
// @author          dystroy
// @version         0.1
// @run-at          document-end
// @match			http://127.0.0.1:8204/* 
// @match			http://localhost:8204/* 
// @match			http://dystroy.org/miaou/* 
// ==/UserScript==

var code = function(){

    if (!miaou || !miaou.chat) return;

    var IAmPingedRegex = new RegExp('@'+me.name+'(\\b|$)');
    // when a message comes in, let's handle it
    miaou.chat.on('incoming_message', function(m){
        if (!(m.created > miaou.chat.enterTime)) return; // we only handle new messages
        if (IAmPingedRegex.test(m.content) && m.author!==me.id) {
            // we've been pinged, let's pong, maybe
            var delay = 5000*Math.random();
            if (delay > 2000) setTimeout(function(){
                miaou.chat.sendMessage("@"+m.authorname+"#"+m.id+" "+(~m.content.indexOf("pong") ? "ping" : "pong!"));
            }, delay);
        } else if (/^echo [^\n]+$/.test(m.content)) {
            // somebody wants us to repeat, let's do it
            miaou.chat.sendMessage(m.authorname + " says\n> " + m.content.slice("echo ".length));
        }
    });

    var deco = ['','*','**','---','`',' '];
    // when a message is sent by the host user, let's make it prettier
    miaou.chat.on('sending_message', function(m){
        if (/^[\-*`]*flip[\-*`]* [^\n`*\/]*$/.test(m.content)) {
            m.content = flipString(m.content.slice("flip ".length));
        } else if (/^\w[^\n`*\/]*$/.test(m.content)) {
            m.content = m.content.split(' ').map(function(t, b){
                return b = deco[~~(Math.random()*deco.length)], b+t+b;
            }).join(' ');
        }
    });

    // Now... Please test your bots in room where you won't disturb everybody ^^
}

var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);


function flipString(aString) {
//    aString = aString.toLowerCase();
    var last = aString.length - 1;
    var result = "";
    for (var i = last; i >= 0; --i) {
        result += !!flipTable[aString.charAt(i)]?flipTable[aString.charAt(i)]:aString.charAt(i)
    }
    return result;
}

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

