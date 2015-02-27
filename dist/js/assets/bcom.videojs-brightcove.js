var VideoJS = {};
var videoJSWidgetObj = {};

(function( win, $, undefined ) {
    'use strict';

    // Setup Custom Events for 
    var evt_fetchDataById = document.createEvent('Event');
    	evt_fetchDataById.initEvent('fetchedDataById', true, true);
    
    var evt_initPlayers = document.createEvent('Event');
    	evt_initPlayers.initEvent('playersInitted', true, true);
    
    var evt_initSinglePlayer = document.createEvent('Event');
    	evt_initSinglePlayer.initEvent('playerInitted', true, true);
    
    var videojsWidget = {};
    var _data = {
    	apis: {
    		media: {
    			commands: [ 'search_videos', 'find_video_by_id', 'find_all_videos' ],
    			filters: [ 'video_id', 'all=tag:', 'none=tag:', 'sort_by=', 'page_number=', 'page_size=', 'get_item_count=', '=CREATION_DATE:' ]
    		}, 
    		tokens: [ 'mSs7049lqF2NZe_nAJNIDg1FQDco9YtZEk8YfbwYAEo.', 'LQQ1lepeYOtRowHPofjWKf4Cmw54Sb3ZJo1pXa9so24.', 'UtStY5Lr9ydJtzMcHFeumhdUrAmZC37febmmPfpMUBY=' ],
    		baseURL: '//api.brightcove.com/services/library?command=',
    		protocol: 'http:'
    	},
    	unInittedPlayers: [],
    	playersObjs: {}
    };

    VideoJS = function(){
    	if( ! (this instanceof VideoJS))
    		return new VideoJS();
    };

    VideoJS.prototype = {
    	init: function( params ){
    		this.eventHandlers();

    		if(typeof(params.videoObjsRefs) !== 'undefined'){
				BCMAPI.token = _data.apis.tokens[2];
	    		_data.unInittedPlayers = params.videoObjsRefs;
	    		this.processVidObjs();
    		}else{}
    	},
    	getObjData: function(){
    		return _data;
    	},
    	getPlayerObjById: function( id ){
    		return _data.playersObjs[id].videojsObj;
    	}, 
    	processVidObjs: function(){
    		if(_data.unInittedPlayers.length > 0){
    			this.initVideo(_data.unInittedPlayers[0]);
    		}else{
    			document.dispatchEvent(evt_initPlayers);
    		}
    	},
    	eventHandlers: function(){
    		var thisRef = this;

    		document.addEventListener('fetchedDataById', function (e) {
    			/*console.log('fetchedDataById');*/
    		}, false);
    		document.addEventListener('playerInitted', function (e) {
    			/*console.log('playerInitted: Player at the current Index has been initted and recorded.');*/
    			_data.unInittedPlayers.shift();
    			thisRef.processVidObjs();
    		}, false);
    		document.addEventListener('playersInitted', function (e) {
    			console.log('playersInitted: All Players are Ready.');
    		}, false);
    	},
    	fetchedDataByIdSuccess: function(pResponse){
    		var nodeName1 = 'data';
	    	_data.playersObjs[pResponse.id][nodeName1] = pResponse;

	    	document.dispatchEvent(evt_fetchDataById);
	    	document.dispatchEvent(evt_initSinglePlayer);
	    },
    	initVideo: function( id ){
    		var jqObj = $('#' + id);
    		var video_id = jqObj.attr('data-video-id');
    		var nodeName1 = 'playerObjId';
    		var nodeName2 = 'videojsObj';
    		var nodeName3 = 'bcId';
    		var tempVidObj = videojs(id);
    		
    		_data.playersObjs[video_id] = {};
    			_data.playersObjs[video_id][nodeName1] = id;
    			_data.playersObjs[video_id][nodeName2] = tempVidObj;
    			_data.playersObjs[video_id][nodeName3] = video_id;

    		BCMAPI.callback = "videoJSWidgetObj.fetchedDataByIdSuccess";
    		BCMAPI.find("video_by_id", video_id);
    	},
    	getVideos: function( params ){
    		var thisRef = this;
    		var thisApiUrl = _data.apis.protocol + _data.apis.baseURL + _data.apis.media.commands[0] + '&token=' + _data.apis.tokens[2];
    			if(typeof(params.page_size) !== 'undefined')
    				thisApiUrl = thisApiUrl + '&' + _data.apis.media.filters[5] + params.page_size;
    			if(typeof(params.sort) !== 'undefined')
    				thisApiUrl = thisApiUrl + '&sort_by' + _data.apis.media.filters[7] + params.sort;

    		$.ajax({
    			url: thisApiUrl,
    			dataType: 'json'
    		}).done(function(data){
    			if(typeof(params.fn) !== 'undefined'){
    				var fn = window[params.fn];
    				fn(data);
    			}
    		}).fail(function(){ console.log("Failed"); });
    	},
    	bindThumbToFeaturedPlayer: function( jqString, player){
    		var thisRef = this;
    		var thisObj = $(jqString);

    		thisObj.on('click', function(){
    			player.catalog.getVideo(thisObj.attr('data-video-id'), function(error, video){ 
	                console.log("PLAYING NEXT VIDEO."); 
	                console.log(video);

	                player.catalog.load(video);
	            });
    		});
    	}
    };
})(window, jQuery);

var bc_contentLists = {
	'recent': {}
};

$(function(){
	videoJSWidgetObj = VideoJS();
	videoJSWidgetObj.init(
		{
			featuredIndex: 0,
			videoObjsRefs: [ 'featuredPlayer', 'sidebarPlayer'/**/ ]
		}
	);

	videoJSWidgetObj.bindThumbToFeaturedPlayer( '.video-eco__thumbslider--item a', videoJSWidgetObj.getPlayerObjById(4030141014001));
});

function vidEco_buildCarousel( data ){
	console.log("initUI");
	console.log(data);
	console.log("------------------------");
}




