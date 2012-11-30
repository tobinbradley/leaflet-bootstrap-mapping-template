// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

// jQuery pub/sub plugin by Peter Higgins modified by Tobin Bradley
(function(d){var cache={};d.publish=function(topic,args){cache[topic]&&d.each(cache[topic],function(){try{this.apply(d,args||[]);}catch(err){console.log(err);}});};d.subscribe=function(topic,callback){if(!cache[topic]){cache[topic]=[];}
cache[topic].push(callback);return[topic,callback];};d.unsubscribe=function(topic,callback){cache[topic]&&d.each(cache[topic],function(idx){if(this==callback){cache[topic].splice(idx,1);}});};d.subscribers=function(topic){l=[];cache[topic]&&d.each(cache[topic],function(idx){l.push(this.name);});return l;};})(jQuery);


// Properly encode and decode URL strings
function urlencode(str) {
    str = escape(str);
    str = str.replace('+', '%2B');
    str = str.replace('%20', '+');
    str = str.replace('*', '%2A');
    str = str.replace('/', '%2F');
    str = str.replace('@', '%40');
    return str;
}
function urldecode(str) {
    str = str.replace('+', ' ');
    str = unescape(str);
    return str;
}

// Determine if n is a number
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

