Date.prototype.getMonthName = function() {
var m = ['January','February','March','April','May','June','July',
'August','September','October','November','December'];
return m[this.getMonth()];
};
Date.prototype.getDayName = function() {
var d = ['Sunday','Monday','Tuesday','Wednesday',
'Thursday','Friday','Saturday'];
return d[this.getDay()];
};

$(document).ready(function() {
	skipNum = 10;
	$oldPosts = $('#oldPosts');
	var socket = io.connect();

	//Load old posts from DB
	socket.on('load post', function(data){
		if(data){
			for (var i=0; i < data.length;i++ ){
				loadOldPosts(data[i], false);
			}
			addClicks();
		} else {
			console.log("error");
		}
	});

	//New Posts - Enter and Click
	$(document).keypress(function(e) {
		if(e.which == 13) {
			subPost = submitPost(e);
			//e.preventDefault();
			//t = +new Date();
			//newPost = {post: $('#postInp').val(), date: t};
			//loadOldPosts(newPost);
			socket.emit('add post', subPost);
			//$('#postInp').val("");
		}
	});

	$('#postForm').submit(function(e){
		e.preventDefault();
		var nPost = $('#postInp').val();
		$oldPosts.prepend($('<div/>').attr("class", "old-post").html(nPost));
		t = +new Date();
			socket.emit('add post', {post: nPost, date: t});
		$('#postInp').val("");
	});

	//Load Older Posts
	$('#oldestButton').click(function(e){
		e.preventDefault();
		socket.emit('get older posts', skipNum);
		skipNum += 10;
	});

	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() == $(document).height()) {
	    socket.emit('get older posts', skipNum);
		skipNum += 10;
	   }
	});
	
	socket.on('post updated', function(data){
		console.log(data);
	});

	socket.on('post url', function(data){
		console.log(data);
	});



//JQuery Dependent Helper Functions
function submitPost(ev){
	ev.preventDefault();
	var t = +new Date();
	var newPost = {post: $('#postInp').val(), date: t};
	loadOldPosts(newPost, true);
	$('#postInp').val("");
	addClicks();
	return newPost;
	
}

function loadOldPosts(post ,n){
		var pretty = prettyDate(post.date);
		var postLink = findUrls(post.post);
		console.log(postLink[0]);
		var htmlPost = Autolinker.link( post.post, { className: "myLink", stripPrefix:true } );
		var nPT = $('<div/>').addClass('old-post').attr("id", post.date).html($('<i/>').text(pretty[1])).append($('<div/>').addClass('pm').html(htmlPost)).append($('<input/>').addClass('form-control hide').attr({"type":"text","value":post.post}));
		if (pretty[0] === 0) {
				nPT.append($('<a/>').addClass('edit-link').text('edit'));
		}
			//$oldPosts.prepend($('<div/>').attr("class", "old-post").text(data.post));
		if (n == true){
			$oldPosts.prepend(nPT);
		} else {
			$oldPosts.append(nPT);
		}
		
}

function addClicks(){
	$('a.edit-link').click(function(e){
		e.preventDefault();
		$inp = $(this).siblings("input");
		$(this).siblings(".pm").hide();
		$inp.removeClass("hide");
		if ($(this).siblings('.update-link').length == 0){
			//Editing Posts
				$inp.after($('<button/>').addClass('btn btn-primary update-link').text('Update').click(function(){
					newText = $(this).siblings("input").val();
					parID = parseInt($(this).parent().attr("id"));
					upd = +new Date();
					sending = {post: newText, updated: upd, ind: parID};
					socket.emit('update post', sending);
					$(this).siblings(".pm").html(Autolinker.link( newText, { className: "myLink", stripPrefix:true } )).show();
					$(this).siblings("input").fadeOut();
					$(this).fadeOut();
				}));
		}

	});
}

}); //End Document Ready


function dateDisp(DateObj){
	d = new Date(DateObj);
	var datetoDisp = "";
	datetoDisp += d.getDayName() +" - "+d.getMonthName()+ " - " + d.getDate() + " - "+d.getFullYear();
	return datetoDisp;
}

function prettyDate(time){
	var date = new Date(time),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 )
		return;
			
	var phrase = day_diff === 0 && (
							diff < 60 && "Just now" ||
							diff < 120 && "1 minute ago" ||
							diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
							diff < 7200 && "1 hour ago" ||
							diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago on " + date.getDayName() ||
		day_diff < 365 && Math.ceil( day_diff / 7 ) + " weeks ago on " + date.getDayName() +" - "+date.getMonthName()+" - "+date.getDate() ||
		day_diff > 365 && date.getMonthName() + " - "+date.getDate()+" - "+date.getFullYear() ;
	return [day_diff, phrase];
}

function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}


