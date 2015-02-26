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
    			/*console.log('playersInitted: All Players are Ready.');
    			console.log(_data.playersObjs);
    			console.log(_data.playersObjs[4030141014001].bcId);*/
    			alert(_data.playersObjs[4030141014001].bcId);
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
    		var retVar = {};
    		var thisApiUrl = _data.apis.protocol + _data.apis.baseURL + _data.apis.media.commands[0] + '&token=' + _data.apis.tokens[2];
    			if(typeof(params.page_size) !== 'undefined')
    				thisApiUrl = thisApiUrl + '&' + _data.apis.media.filters[5] + params.page_size;
    			if(typeof(params.sort) !== 'undefined')
    				thisApiUrl = thisApiUrl + '&sort_by' + _data.apis.media.filters[7] + params.sort;
    			//if(typeof(params.retVar) !== 'undefined')

    			//console.log(thisApiUrl);

    		$.ajax({
    			url: thisApiUrl,
    			dataType: 'json'
    		}).done(function(data){
    			/*console.log("getVideos sucess");
    			console.log(data);
    			bc_contentLists.recent = data;*/
    			if(typeof(params.retVar) !== 'undefined')
    				params.retVar = data;
    		}).fail(function(){
    			//console.log("getVideos failed");
    		});

    		return retVar;
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
	// Get Videos to populate the carousels: returns JSON
	/*bc_contentLists.recent = videoJSWidgetObj.getVideos({
		'retVar': bc_contentLists.recent
		'page_size': 20,
		'sort': 'DESC'
	});*/
	videoJSWidgetObj.getVideos({ 'retVar': bc_contentLists.recent, 'page_size': 20, 'sort': 'DESC' });
		/*console.log("bc_contentLists.recent: ------");
		console.log(bc_contentLists.recent);*/
});



/*var thisApi = _data.apis;
console.log('Search Videos: ' + thisApi.protocol + thisApi.baseURL + thisApi.media.commands[0] + '&token=' + thisApi.tokens[2] );
console.log('Search Videos: ' + thisApi.protocol + thisApi.baseURL + thisApi.media.commands[1] + '&' + thisApi.media.filters[0] + '=' + '4080467172001' + '&token=' + thisApi.tokens[2]);
videoJSWidgetObj.getVideos({'page_size': 20,'sort': 'DESC'})*/




