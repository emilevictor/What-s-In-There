var gRoomData = null
var $xml = null
var xmlDoc = null
var coursesArray = null
var soWittyIndex = 0;
var soWitty = ['Now powered by magical <a href="http://www.uqrota.net">UQRota</a> dust!',
	'Now with 10% less soylent green in every refec meal!',
	'By Emile Victor, Michael Mallon & Alex Wilson',
	'This is the result of procrastination',
	'More fun than si-net',
	'More healthy than UQ Subway'];
var buildingsSTL = {}
var buildingsGATTN = {}
var buildingsIPSWC = {}
var currentCampus = "STL"
var buildings = {}
var currentSemester = "6260" //Hardcoded: must be updated.
var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
var longDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

$(document).ready(function() {
	$("#buildingRoomQuery").hide();
	$("#errorMessage").hide();
	$("#results").hide();
	$("#header").hide();
	$("#loader").hide();
	$("#header").show("slide", {direction: "up"},200);

	$("#lulzyMessage").hide();
	soWittyIndex = Math.floor(Math.random()*soWitty.length);
	$("#lulzyMessage").append(soWitty[soWittyIndex]);
	setTimeout("showLulzyMessage()",500);
	var timer = setInterval("showNextMessage()",15000);

	$("#buildingRoomQuery").show("slide", {direction: "up"},200)

	var today = new Date().getDay()-1;
for (var i = 0; i < days.length; i++) {
	if (today == i) {
		$("#day").append('<option value="'+days[i]+'" selected="selected">'+longDays[i]+' (Today)</option>');
	} else {
		$("#day").append('<option value="'+days[i]+'">'+longDays[i]+'</option>');
	}
}

//We need to fetch the array of buildings from http://rota.eait.uq.edu.au/buildings.xml

$("#stlucia").click(function() {
	currentCampus = "STL"
});

$("#ipswitch").click(function () {
	currentCampus = "ipswitch"
})

$("#Gatton").click(function () {
	currentCampus = "gatton"
})


//Get the current semester

// $.ajax({
// 		url:"http://rota.eait.uq.edu.au/semesters.xml",
// 		dataType: 'text',
// 		success:function(data){
// 			xmlDoc = $.parseXML(data);
// 			$xml = $(xmlDoc)

// 			$xml.find('semester').each(function(){
// 				if($(this).attr('current')=='true') {
// 				   currentSemester = $(this).text();
// 				}

// 			});

// 		},
// 		error:function(){
// 			alert("Error fetching the current semester");
// 			return
// 		}
// 	});


$("#selectRoom").click(function() {
	showLoader();
	$("#buildingRoomQuery").hide("slide", {direction: "up"},200)

	//Hide the menu, show a spinner while we load.

	//Now we need to hit up rota to get the data we need.
	$.ajax({
		url:'http://rota.eait.uq.edu.au/offerings/find.xml?with={"course_code":"'+$('#roomName')[0].value+'","semester_id":"6260"}',
		dataType: 'text',
		success:function(data){
			// do stuff with json (in this case an array)
			gRoomData = data;
			//gRoomData = "<rss version='2.0'>" + gRoomData.toString + "</rss>"
			xmlDoc = $.parseXML(gRoomData);
			$xml = $(xmlDoc)

		/*
		//Filter for today's date
		var today = new Date();
		dayIndex = today.getDay();
		var todayShortDate = days[dayIndex-1]
		*/
		if ($('#errorMessage').is(':visible')) {
			$('#errorMessage').empty();
			$('#errorMessage').hide();
		}
	if ($xml.find('id').length==0) {
		$('#errorMessage').empty();
		$('#errorMessage').append('<p class="className">Class does not exist</p>');
		$("#loader").hide();
		$('#errorMessage').show("slide", {direction: "up"},200);
		$("#buildingRoomQuery").show("slide", {direction: "up"},200);
	} else {
		$xml.find('id').each(function() {
			$.ajax({
				url:'http://rota.eait.uq.edu.au/offering/'+$(this).text()+'.xml',
				dataType: 'text',
				success:function(data){
					$('#results').empty();
					xmlDoc2 = $.parseXML(data);
					$xml2 = $(xmlDoc2);
					$xml2.find('session').each(function() {
						var d = $(this).find('day').text();
						var st = $(this).find('start').text();
						var fn = $(this).find('finish').text();
						var bname = $(this).find('name').text();
						var bnum = $(this).find('number').text();
						var camp = $(this).find('campus').text();
						var rm = $(this).find('room').text();
						if (camp == 'STLUC') {
							camp = "St Lucia";
						} else if (camp =='GATTN') {
							camp= "Gatton";
						} else if (camp =='IPSWC') {
							camp="Ipswich";
						}
						if ($('#day').val() == d) {
							$('#results').append('<p class="className">'+camp+':  '+st+'-'+fn+'</p>');
							$('#results').append('<p class="day">'+bnum+' ('+bname+'), Room '+rm+'</p>');
						}
					});
					if ($('#results').text()=="") {
						$('#results').append('<p class="className">'+$('#roomName').val()+' is not on.</p>');
						$('#results').append('<p class="day">Try a different day?</p>');
					}
					$("#loader").hide();
					showResults();
				}
			});

		});

	}
		}
	});
});

$("#header").click(function() {
	$("#results").hide("slide", {direction: "up"},200);
	$("#buildingRoomQuery").show("slide", {direction: "up"},200)
});

});

function showLulzyMessage()
{
	$("#lulzyMessage").fadeIn('slow');
}

function showNextMessage() 
{
	$("#lulzyMessage").fadeOut('fast', function() {

		soWittyIndex += 1;
		if (soWittyIndex == soWitty.length)
	{
		soWittyIndex = 0;
	}
	$("#lulzyMessage").empty();
	$("#lulzyMessage").append(soWitty[soWittyIndex]);
	$("#lulzyMessage").fadeIn('slow')

	});




}

function showLoader()
{
	$("#loader").fadeIn('slow');
}

function showResults()
{
	$("#results").fadeIn('slow');
	$("#buildingRoomQuery").hide("slide", {direction: "up"},200)
}


function hideErrorMessage()
{
	$("#errorMessage").hide("slide", {direction: "up"},200);
}
