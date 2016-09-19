
/**
 * DynamicPlayerLoader.js plugin
 * 
 * 
 * Dave Bornstein
 */


/* TODO:
1. Allow page to override video properties like width, position, etc with an object
2. Turn this into a class
3. Remember players when we create them so we can destroy all that we created
*/


function destroyAllPlayers() {
	try{ videojs; }
	catch(e) {
	    return
    }
	
	var playerList = videojs.getPlayers();
	for (var p in playerList) {
		destroyPlayer( p )
	}
}

function destroyPlayer( vjsId) {
	//console.log(videojs.getPlayers())

	player = videojs.getPlayers()[vjsId]
	if (player) {
		player.dispose()
	}
}

function loadVideo( vjsId, video) {

	if (! video) {
		return
	}

	console.log('[' + vjsId + '] loadVideo')
	console.log(video)

	var videoObject = new Object();
	videoObject.id = video.videoId || "";
	videoObject.name = video.metadata.name || "";
	videoObject.description = video.metadata.description || "";
	videoObject.account_id = video.accountId || "";
	videoObject.sources = video.src;

	videojs(vjsId).ready(function() {
    	this.mediainfo = videoObject;
     	this.src(this.mediainfo.sources);
    });

	// // Load a VC Video
	// videojs(vjsId).ready(function() { 
	// 	console.log('Player is ready, loading media')
    //  		var player = this;
   	// 	player.catalog.getVideo(video, function(error, video) {
    //            player.catalog.load(video);
    //        });
	// });

}

function createPlayer(vjsId, pid, div, inVideo) {
	
	// console.log("vjsId: " + vjsId)
	// console.log("pid: " + pid)
	// console.log("div: " + div)
	// console.log("inVideo: " + inVideo)

	var myCfg = _cfg.players[pid];
	myCfg['pid'] = pid
	var product = myCfg['product'] || 'vc'
	var playlistId = myCfg['playlistId'] || null;

	// xxx - validate myCfg was loaded or throw an error

	var video = inVideo || myCfg.defaultVideo || null;

	console.log("VIdeo is " + video)
	console.log("[" + vjsId + "] Dyanmically loading player " + pid + "[" + myCfg.bcPlayerId  +"] into " + div)
   
	var config = {
		'accountId':      myCfg.accountId,
		'dataPlayerId':   myCfg.bcPlayerId,
		'targetDiv':      div,
		'playerId':       vjsId
	};

	if (video) {
		config['videoId'] = video
	}

	// Load the player script first
	var playerScript = "http://players.brightcove.net/" + config.accountId + "/" + config.dataPlayerId + "_default/index.min.js";
	
	console.log('loading player: ' + playerScript)
	jQuery.getScript(playerScript, function(data, status, jqxhr) {

		//player script is loaded, now make the player object and load it.
		var playerHTML = '<div style=\"display: block; position: relative;\"><div style=\"padding-top: 56.25%;\">' +
				 '<video id=\"' + config.playerId + '\"  data-account=\"' + config.accountId 

		if (playlistId) {
			playerHTML +=  '\"  data-playlist-id=\"' + playlistId;
		} else {
			if ( product != "perform" && video)  {
				console.log("Adding Video ID: [" + video + "] to the HTML5 Video Element")
				playerHTML +=  '\"  data-video-id=\"' + config.videoId
			}
		}

		playerHTML += '\" data-player=\"' + config.dataPlayerId + 
				  '\" data-embed=\"default\" class=\"video-js\" controls  ></video></div></div>';


		console.log("PlayerInnerHTML: " + playerHTML)
		document.getElementById(config.targetDiv).innerHTML = playerHTML;
		var newDiv = document.getElementById(config.playerId)

		// XXX Do we need to put these in the config file?
		newDiv.style.position = "absolute";
		newDiv.style.top = "0px";
		newDiv.style.bottom = "0px";		
		newDiv.style.left = "0px";
		newDiv.style.right = "0px";
		newDiv.style.width = "100%";
		newDiv.style.height = "100%";

		bc(document.getElementById(config.playerId));


		initPlugins(vjsId, myCfg);

		console.log( "Product is " + product)
		if ( product == "perform" && video) {
			console.log('Using Perform, Loading Video')
			vid = _cfg.videos[video] || {}
			if (! vid) {
				console.log('Could not find video: ' + video)
			} else {
				loadVideo(vjsId, vid);
			}	
		}
	});
}

function initPlugins( vjsId, config ) {

	var player  = videojs.getPlayers()[vjsId]; 
	var plugins = config.plugins || {};

	for (var pluginName in plugins) {

		var plugin = plugins[pluginName]

		if (plugin.css) {
			$("<link/>", {
			   rel: "stylesheet",
			   type: "text/css",
			   href: plugin.css
			}).appendTo("head");
		}
		
		if (plugin.js) {
			jQuery.getScript(plugin.js)
			.done(function() {
				player[pluginName](plugin.options)
			});
		}
	}
}



// function displayJSONFile(url,container) {

// 		var json = $.getJSON(url, function (data ) {
// 			var str = '<pre>' + syntaxHighlight(JSON.stringify(data, undefined, 2)) + '</pre>';
// 			$(container).html(str)
// 		});
// }


// function syntaxHighlight(json) {

//     json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//     return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
//         var cls = 'number';
//         if (/^"/.test(match)) {
//             if (/:$/.test(match)) {
//                 cls = 'key';
//             } else {
//                 cls = 'string';
//             }
//         } else if (/true|false/.test(match)) {
//             cls = 'boolean';
//         } else if (/null/.test(match)) {
//             cls = 'null';
//         }
//         return '<span class="' + cls + '">' + match + '</span>';
//     });
// }

 //Populate video object (normally from database or CMS)

