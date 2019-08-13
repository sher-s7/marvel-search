const URL = "https://gateway.marvel.com/v1/public/comics";
const APIKEY = '92b5e633cdc86f831109d70bfa0af9bf';
const HASH = '3fcd7ab5cc7c0b63ee7c08175c50af5c';
var OFFSET = 0;


function getDataFromAPI(searchTerm, callback){
	params = {
  		apikey: APIKEY,
  		ts: 1,
  		hash: HASH,
  		title: searchTerm,
  		offset: OFFSET,
  		limit: 5,
  		format: 'comic',
  		formatType:'comic'
	};
	$.getJSON(URL, params, callback);
}
function renderResult(result){
	const title = result.title;
	const url = result.urls[0].url;
	var imgsrc;
	var author;
	var writerCapitalized;
	if(result.images[0]){
		imgsrc = `${result.images[0].path}/portrait_incredible.${result.images[0].extension}`;
	}else{
		imgsrc="undefined"
	}
	if(result.creators.items.length>0){
		author = result.creators.items.find(x => x.role === "writer");
	}else{
		author = "";
	}
	console.log(author);
	if(author != "" && author!=undefined){
		var writer = author.name;
		writerCapitalized = writer.charAt(0).toUpperCase() + writer.slice(1);
	}else{
		writerCapitalized = "";
	}
	console.log(writerCapitalized)
	if(imgsrc!="undefined"){
		return `
		<div class="row">
			<div class="col-6">
				<img src="${imgsrc}" class="cover">
			</div>
			<div class="col-6">
				<div class="title"><a href=${url}>${title}</a></div>
				<div class="writer"> ${writerCapitalized}</div>
			</div>
		</div>
		`
	}else{
		return `
		<div class="row">
			<div class="col-6">
				<img src="notfound.svg" class="cover">
			</div>
			<div class="col-6">
				<div class="title"><a href=${url}>${title}</a></div>
			</div>
		</div>
		`
	}
}

function displayResults(comicdata){
	console.log(comicdata);
	const results = comicdata.data.results.map((comic) => renderResult(comic));
	$('.js-results').html(results);
}


function watchSubmit(){
	$('.js-character').submit(event => {
		event.preventDefault();
		$('.js-results').empty();
		$('h1, section').removeClass('hidden');
		var character = $('.js-input').val();
		$('.js-input').val("");

		getDataFromAPI(character, displayResults);
	
	})
}

$(watchSubmit)