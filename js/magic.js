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
				'More healthy than UQ Subway']
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
	$("#advanced").hide();
	$("#header").show("slide", {direction: "up"},200);

	$("#lulzyMessage").hide();
	showLoader();
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


	$.ajax({
			url:"http://rota.eait.uq.edu.au/buildings.xml",
			dataType: 'text',
			success:function(data){
				xmlDoc = $.parseXML(data);
				$xml = $(xmlDoc)
				
				$xml.find('building').each(function() {

					//Currently restricted to St Lucia

					if ($(this).find('campus code').text() == 'STLUC')
					{
						buildingsSTL[$(this).find('number').text()] = $(this).find('id').text()
					} else if ($(this).find('campus code').text() == 'GATTN')
					{
						buildingsGATTN[$(this).find('number').text()] = $(this).find('id').text()

					} else if ($(this).find('campus code').text() == 'IPSWC')
					{
						buildingsIPSWC[$(this).find('number').text()] = $(this).find('id').text()
					}

				});

				$("#loader").fadeOut('slow', function() {
					$("#buildingRoomQuery").show("slide", {direction: "up"},200);
				});


			},
			error:function(){
				alert("Error fetching buildings");
				return
			}
		});



	$("#selectRoom").click(function() {
		showLoader();
		$("#buildingRoomQuery").hide("slide", {direction: "up"},200)

		//showResults();
		room = $("#roomName").val();
		roomSplit = room.split('-');

		if (roomSplit.length < 2)
		{
			$("#errorMessage").html("You need to put a hyphen between the building number and room number.");
			$("#errorMessage").show("slide", {direction: "up"},200);
			var timer = setTimeout("hideErrorMessage()",5000);
			return;
		} else {
			for (var i = 0; i < roomSplit.length; i++)
			{
				//Trim everything so that we don't have any spaces anywhere.
				roomSplit[i] = $.trim(roomSplit[i])
			}
		}




		//Hide the menu, show a spinner while we load.

		//Now we need to hit up rota to get the data we need.

		if (currentCampus == "STL")
		{
			buildings = buildingsSTL;
		} else if (currentCampus == "ipswitch")
		{
			buildings = buildingsIPSWC;
		} else if (currentCampus == "gatton") {
			buildings = buildingsGATTN
		}
		$.ajax({
			url:"http://rota.eait.uq.edu.au/building/"+buildings[roomSplit[0]]+"/room/"+roomSplit[1]+"/sessions.xml",
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
		var shortDate = $("#day").val();
		console.log(shortDate)

		var classes = []

		$xml.find('session').each(function() {
			console.log($(this).find('group series offering semester').text())
			if ($(this).find('day').text() == shortDate && ($(this).find('group series offering semester').text() == currentSemester))
			{
				var classObject = {}
				var startDate = Date.parse($(this).find('day').text() + ' ' + $(this).find('start').text());
				var finishDate = Date.parse($(this).find('day').text() + ' ' + $(this).find('finish').text());

				if (startDate == null || finishDate == null)
				{
					console.log("startDate or finishDate null for " + $(this).find('group series offering course').text())
				}
				classObject.course = $(this).find('group series offering course').text()
				classObject.startDate = startDate
				classObject.finishDate = finishDate
				classes.push(classObject);
			} else {
				//This class is not today's.
			}
		})

		//Sort the array

		classes.sort(function(a, b) {
			if (a.startDate != null && b.startDate != null)
			{
				return a.startDate.compareTo(b.startDate);
			} else {
				return 0;
			}
		});

		coursesArray = classes

		$("#loader").hide();
		$("#results").empty();
		$("#results").append("<p class=\"warning\">Please note that the times shown on this page are taken directly from MySI-net... They may (and probably will) contain errors. These are the classes occurring in this room on " + longDays[days.indexOf(shortDate)] + ".");

		for (var i = 0; i < coursesArray.length; i++)
		{
			var startMinutes;
			var finishMinutes;
			if (coursesArray[i].startDate.getMinutes() == 0)
			{
				startMinutes = "00"
			} else {
				startMinutes = coursesArray[i].startDate.getMinutes().toString()
			}

			if (coursesArray[i].finishDate.getMinutes() == 0)
			{
				finishMinutes = "00"
			} else {
				finishMinutes = coursesArray[i].finishDate.getMinutes().toString()
			}
			//Check if the next on the list is at the same time. If so, combine them.
			if (((i+1) < coursesArray.length) && coursesArray[i+1].startDate.compareTo(coursesArray[i].startDate) == 0)
			{
				$("#results").append("<div class=\"indivClass\"><p class=\"className\">Class: "+coursesArray[i].course+" or "+coursesArray[i+1].course+"</p> <p class=\"day\">"+days[coursesArray[i].startDate.getDay()-1] + " | " + coursesArray[i].startDate.getHours().toString()+":"+startMinutes+" - "+coursesArray[i].finishDate.getHours().toString() + ":" + finishMinutes)
				//Skip over
				i++;
			} else {
				$("#results").append("<div class=\"indivClass\"><p class=\"className\">Class: "+coursesArray[i].course+"</p> <p class=\"day\">"+days[coursesArray[i].startDate.getDay()-1] + " | " + coursesArray[i].startDate.getHours().toString()+":"+startMinutes+" - "+coursesArray[i].finishDate.getHours().toString() + ":" + finishMinutes)

			}
		}
		
		if (coursesArray.length == 0)
		{
			$("#results").empty();
			$("#results").append("<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/4tiPOMd14eQ\" frameborder=\"0\" allowfullscreen></iframe>");
		}

		showResults();
			},
			error:function(){
				$("#errorMessage").html("Yeah, I can't find that room anywhere...");
				$("#errorMessage").show("slide", {direction: "up"},200);
				var timer = setTimeout("hideErrorMessage()",5000);
				return
			}
		});

        
		
		




	})

	$("#header").click(function() {
		$("#results").hide("slide", {direction: "up"},200);
		$("#buildingRoomQuery").show("slide", {direction: "up"},200)

	})



	$("#toggleAdvanced").click(function() {
		
		if (currentCampus == "STL")
		{
			generateSelects("St Lucia");
		} else if (currentCampus == "ipswitch")
		{
			generateSelects("Ipswich");
		} else if (currentCampus == "gatton") {
			generateSelects("Gatton");
		}
		$('#advanced').show("slide", {direction: "up"},200);
	});

	$("#buildingSelect").change(function () {
		var i =$("#buildingSelect")[0].value;
		if (i=="null") {
			generateRoomSelect(i);
		} else {
			generateRoomSelect(buildingID[i]);
		}
	});

	$("#roomSelect").change(function () {
		var i = $("#buildingSelect")[0].value;
		var j = $("#roomSelect")[0].value;
		$('#roomName')[0].value=buildingNumber[i]+"-"+j;
		$('#advanced').hide();
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
