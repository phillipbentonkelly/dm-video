var VideoJS = {};
var videoJSWidgetObj = {};

(function( win, $, undefined ) {
    'use strict';

    var videojsWidget = {};
    var _data = {
    	apis: {
    		media: {}, 
    		tokens: ['mSs7049lqF2NZe_nAJNIDg1FQDco9YtZEk8YfbwYAEo.', 'LQQ1lepeYOtRowHPofjWKf4Cmw54Sb3ZJo1pXa9so24.']
    	}
    };

    VideoJS = function(){
    	if( ! (this instanceof VideoJS))
    		return new VideoJS();
    };

    VideoJS.prototype = {
    	init: function( params ){
    		/*
				params = {
					vidsObjs: [ { videojs('myPlayerID') }, { videojs('myPlayerID') } ]
				}
    		*/
    		//(!params.videoObjs)? {} : for(var u = 0; u < params.videoObjs.length; u++){ console.log(params.videoObjs[u]); }
    		BCMAPI.token = _data.apis.tokens[0];
    		//BCMAPI.callback = "this.initVideo";

    		console.log(BCMAPI.find("video_by_id", 4030141014001));

    		console.log(_data.apis.tokens[0]);
    	},
    	initVideo: function( params ){
    		console.log("initVideo....");
    	}
    };
})(window, jQuery);

$(function(){
	videoJSWidgetObj = VideoJS();
	videoJSWidgetObj.init();
});