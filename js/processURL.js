function urlParams() {
	var result = new Object()
	var splitURL = document.URL.split("?");
	if (splitURL.length != 2) {
		result.urlencoded  = false;
		return result;
	}
	var v = splitURL[1].split("&");
	var haveB = false;
	var haveR = false;
	var haveC = false;
	result.day=null;
	for (var i=0; i<v.length; i+=1) {
		var spltv = v[i].split("=");
		if (spltv.length != 2) {
			continue;
		}
		if (spltv[0]=="b") {
			result.building=spltv[1];
			haveB = true;
		} else if (spltv[0]=="c") {
			result.campus = spltv[1];
			haveC = true;
		} else if (spltv[0]=="r") {
			result.room = spltv[1];
			haveR = true;
		} else if (spltv[0]=="d") {
			result.day = spltv[1];
		}
	}

	if (haveB && haveR && haveC) {
		result.urlencoded  = true;
	} else {
		result.urlencoded  = false;
	}
	return result;
}

function useURLEncoded(v) {
	if (v.campus == "STL") {
		$("#stlucia").click();
	} else if (v.campus == "IPS") {
		$("#ipswich").click();
	} else if (v.campus == "GAT") {
		$("#Gatton").click();
	} else {
		return;
	}
	if ($.inArray(v.day,days) >= 0 ) {
		$('#day').val(v.day)
	}
	$("#roomName").val(v.building+"-"+v.room);
	setTimeout('$("#selectRoom").click()',1000)
}
