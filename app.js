
var searchKeys = {};

// Get search query string
var query = window.location.search;
// remove ? from query
query = query.substr(1);

// separate zip and date
var querySplit = query.split('&'); 

// Go through array and split search strings
for(var i = 0; i < querySplit.length; i++) {
	var searchPair = querySplit[i].split('=');
	var searchKey = searchPair[0];
	var searchVal = searchPair[1];
	// create key/value for searchKeys
	searchKeys[searchKey] = searchVal;
}

// Check to see if valid search date for 10 day forecast
function isValidDate() {
	// Get the search date entered
	var date = searchKeys['date'];
	var dateEntered = date.split('/');
	// Convert to number
	var dateToUse = parseInt(dateEntered[1]);
	// Create date object for yyyy/mm/dd entered. Month-1 b/c 0 index based
	dateEntered = new Date(dateEntered[2], dateEntered[0] - 1, dateEntered[1]);
	// Create date object for current date
	var today = new Date();
	// Omit time so can just compare dates for amt of days btw current day & search date
	today.setHours(0, 0, 0, 0);
	// Get number of days difference btw search date & current
	var diff = dateEntered - today;
	var daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
	// If daysDiff > 9 or < 0, not valid for 10 day search
	if(daysDiff > 9 || daysDiff < 0) {
		return; 
	}
	return dateToUse;
}

function isValidZip() {
	// Get zip_code entered in search
	var zip = searchKeys['zip_code'];
	// if < 5 characters or > 5, not valid zip (if not valid 5-dig zip, API won't return info so that's handled)
	if(zip.length < 5 || zip.length > 5) {
		return;
	}
	return zip;
} 

$(function() {
	// Get city & state from API only if date & zip are valid
	if(isValidDate() && isValidZip()) {
		function cityState(data) {	
			var cityName = data.location.city;
			var stateAbbr = data.location.state;
			var header = "WEATHER FORECAST FOR ";

			// API doesn't add . in state abbreviation, also no . for Washington D.C. so if city is DC, add .
		  var stateFirstLetter = stateAbbr.slice(0,1);
		  var stateSecondLetter = stateAbbr.slice(1);

		  if(stateAbbr === 'DC') {
		  	document.getElementById('weather-location').innerHTML = header + cityName.toUpperCase() + ', ' + stateFirstLetter + '.'
		  	  + stateSecondLetter + ".";	
		  } else {
		  	document.getElementById("weather-location").innerHTML = header + cityName.toUpperCase() + ', ' + stateAbbr;
		  }
		}
	}

	function getForecast(data) {
		var searchDay = isValidDate();
		var weatherData = data.forecast.simpleforecast.forecastday;
	 	var slicedArr;

	 	for(var i = 0; i < weatherData.length; i++) {
	 		if(weatherData[i].date.day === searchDay) {
	 			// Get the search date + 2 following days
	 			slicedArr = weatherData.slice(i, i+3);

 				slicedArr.forEach(function(info, index) {

					dayName(info, index);
					weatherIcon(info, index);
					weatherInfo(info, index);

					var today = new Date();
					if(searchDay === today.getDate()) {
						var firstDay = document.querySelector('h2.dayName');
						firstDay.innerHTML = 'Today';
					}

				});
	 		}
	 	}
	}

	$.ajax({
	  url : "http://api.wunderground.com/api/APIKEY/geolookup/q/" + searchKeys['zip_code'] + ".json", 
	  dataType : "jsonp",
	  success : cityState
	});

	$.ajax({
		url: "http://api.wunderground.com/api/APIKEY/forecast10day/q/" + searchKeys['zip_code'] + ".json",
		dataType: "jsonp",
		success: getForecast
	});

}); // End document ready function



function dayName(info, i) {
	var dayName = document.getElementsByClassName('dayName')[i];
		dayName.className += ' day-background';
		dayName.innerHTML = info.date.weekday;
}

function weatherIcon(info, i) {
	var iconSection = document.getElementsByClassName('img-icon')[i];
	var iconUrl = 'http://icons.wxug.com/i/c/g/';
	var icon = info.icon;
 	var iconImg = iconUrl + icon + '.gif';
 	iconSection.setAttribute('src', iconImg);
}

function weatherInfo(info, i) {
	var weatherInfoDiv = document.getElementsByClassName('weather-content')[i];
	var condition = document.createElement('p');
	  condition.innerHTML = info.conditions +'<br>' +
     '<p><strong>' + info.high.fahrenheit + '&deg;</strong> / ' + info.low.fahrenheit + '&deg;' + " F";
     weatherInfoDiv.append(condition);
}




