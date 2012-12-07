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

/* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+ */
;(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:250,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);
