var gRoomData = null
var $xml = null
var xmlDoc = null
var coursesArray = null
var soWittyIndex = 0;
var soWitty = ['Now powered by magical <a href="http://www.uqrota.net">UQRota</a> dust!',
				'Now with 10% less soylent green in every refec meal!',
				'By Emile Victor, Michael Mallon & Alex Wilson']

$(document).ready(function() {
	$("#buildingRoomQuery").hide();
	$("#errorMessage").hide();
	$("#results").hide();
	$("#header").hide();
	$("#header").show("slide", {direction: "up"},200);
	$("#lulzyMessage").hide();
	soWittyIndex = Math.floor(Math.random()*soWitty.length);
	$("#lulzyMessage").append(soWitty[soWittyIndex]);
	setTimeout("showLulzyMessage()",500);
	var timer = setInterval("showNextMessage()",15000);
	$("#buildingRoomQuery").show("slide", {direction: "up"},200)


	$("#selectRoom").click(function() {
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

		$.ajax({
			url:"http://rota.eait.uq.edu.au/building/"+roomSplit[0]+"/room/"+roomSplit[1]+"/sessions.xml",
			dataType: 'text',
			success:function(data){
				// do stuff with json (in this case an array)
				gRoomData = data;
				//gRoomData = "<rss version='2.0'>" + gRoomData.toString + "</rss>"
				console.log("I am doing f all")
				xmlDoc = $.parseXML(gRoomData);
				$xml = $(xmlDoc)
				

			},
			error:function(){
				alert("Error");
				return
			},
			async: false
		});

		//Filter for today's date
		var today = new Date();
		dayIndex = today.getDay();

		var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

		var todayShortDate = days[dayIndex-1]
		console.log(todayShortDate)

		var classes = []

		$xml.find('session').each(function() {

			if ($(this).find('day').text() == todayShortDate)
			{
				var classObject = {}
				var startDate = Date.parse($(this).find('start').text());
				var finishDate = Date.parse($(this).find('finish').text());

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


		$("#results").empty();
		$("#results").append("<p class=\"warning\">Please note that the times shown on this page are taken directly from MySI-net... They may (and probably will) contain errors. These are the classes occurring in this room today.");

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
			//$("#results").empty();
			$("#results").append("<div class=\"indivClass\"><p class=\"className\">Class: "+coursesArray[i].course+"</p> <p class=\"day\">"+days[coursesArray[i].startDate.getDay()-1] + " | " + coursesArray[i].startDate.getHours().toString()+":"+startMinutes+" - "+coursesArray[i].finishDate.getHours().toString() + ":" + finishMinutes)
		}
		
		if (coursesArray.length == 0)
		{
			$("#results").empty();
			$("#results").append("<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/4tiPOMd14eQ\" frameborder=\"0\" allowfullscreen></iframe>");
		}

		var timer = setTimeout("showResults()",200);




	})






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

function showResults()
{
	$("#buildingRoomQuery").hide("slide", {direction: "up"},200)
	$("#results").show("slide", {direction: "up"},1000);
}


function hideErrorMessage()
{
	$("#errorMessage").hide("slide", {direction: "up"},200);
}