let njtdebug=!0;window.njt=new function(t){if(void 0===t)this.debug=!1;else if(t){this.debug=!0,(window.navigator.userAgent.indexOf("MSIE ")>0||navigator.userAgent.match(/Trident.*rv\:11\./))&&console.log("IE detected! No promises made on NJTools functionality here...")}else this.debug=!1;this.log=function(t){this.debug&&console.log(t)},this.types={UNKNOWN:-3,NAN:-2,UNDEFINED:-1,NULL:0,BOOLEAN:1,NUMBER:2,BIGINT:3,STRING:4,SYMBOL:5,FUNCTION:6,ARRAY:7,OBJECT:8,INFINITY:9},this.js=new function(){this.typeOf=function(t){let e=typeof t;return"undefined"===e?njt.types.UNDEFINED:"boolean"===e?njt.types.BOOLEAN:"number"===e?NaN===t?njt.types.NAN:t===1/0?njt.types.INFINITY:njt.types.NUMBER:"bigint"===e?njt.types.BIGINT:"string"===e?njt.types.STRING:"symbol"===e?njt.types.SYMBOL:"function"===e?njt.types.FUNCTION:"object"===e?null===t?njt.types.NULL:Array.isArray(t)?njt.types.ARRAY:njt.types.OBJECT:njt.types.UNKNOWN},this.validate=function(t,e){for(let n in e)if(njt.js.typeOf(t[n])!=e[n])return!1;return!0},this.getRandomInt=function(t,e){return e+=1,t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t)+t)}},this.dom=new function(){this.getElementById=function(t){return document.getElementById(t)},this.getElementsByAttribute=function(t){return document.querySelectorAll("["+t+"]")},this.getElementsByAttributeWithValue=function(t,e){return document.querySelectorAll("["+t+'="'+e+'"]')},this.getElementsByClass=function(t){return document.getElementsByClassName(t)},this.getElementsWhereClassContains=function(t){return document.querySelectorAll('[class*="'+t+'"]')},this.getElementsWhereClassBegins=function(t){return document.querySelectorAll('[class^="'+t+'"]')},this.getElementsWhereClassEnds=function(t){return document.querySelectorAll('[class$="'+t+'"]')}},this.req=new function(){this.get=function(t,e){let n=new XMLHttpRequest;n.open("GET",t,!0),n.onload=e,n.send()},this.post=function(t,e,n){let i=new XMLHttpRequest;i.open("POST",t,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded");let s="";for(let t in e)s.length>0&&(s+="&"),s=s+Structure.encodePOST(t)+"="+Structure.encodePOST(e[t]);i.onload=n,i.send(s)}},this.event=new function(){this.funct=new Object,this.queue=new Object,this.eventHandler=function(t){let e=t.target.attributes["njtevent"+t.type];if(void 0!==e){let n=njt.event.funct[e.value];"function"==typeof n&&n(t)}},this.addFunction=function(t,e){njt.event.funct[t]=e},this.createQueue=function(t,e,n){this.queue[t]=new this.queueWrapper(e,n)},this.queueWrapper=function(t,e){this.eventOccured=!1,this.functionArray=[],this.push=function(t){this.eventOccured?(njt.log("Event "+e+" has passed executing immediately"),t()):(njt.log("Added function to "+e+" queue"),this.functionArray.push(t))},t.addEventListener(e,function(t){this.eventOccured=!0;for(var e=this.functionArray.length,n=0;n<e;)this.functionArray[n](t),n+=1}.bind(this))},this.triggerSyntheticEvent=function(t,e,n){t.dispatchEvent(new CustomEvent(e,{detail:n}))},this.createQueue("htmlloaded",document,"DOMContentLoaded"),this.createQueue("pageloaded",window,"load")},this.id=null,this.element=null,this.snip=null,this.modal=null,this.formbuilder=null}(njtdebug);