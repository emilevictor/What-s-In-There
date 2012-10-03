var gRoomData = null
var $xml = null
var xmlDoc = null

$(document).ready(function() {
	$("#buildingRoomQuery").hide();
	$("#errorMessage").hide();
	$("#results").hide();

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

		$xml.find('session').each(function() {
			console.log($(this).find('day').text())
			if ($(this).find('day').text() == todayShortDate)
			{
				console.log("OHAI")
				$("#results").append("<div class=\"indivClass\"><p class=\"className\">Class: "+$(this).find('group series offering course').text()+"</p> <p class=\"day\">"+$(this).find('day').text() + " | " + $(this).find('start').text()+" - "+$(this).find('finish').text()+"</p></div>")
			} else {
				console.log($(this).find('day').text() + " vs " + todayShortDate)
			}
		})

		var timer = setTimeout("showResults()",200);




	})






});

function showResults()
{
	$("#buildingRoomQuery").hide("slide", {direction: "up"},200)
	$("#results").show("slide", {direction: "up"},3000);
}


function hideErrorMessage()
{
	$("#errorMessage").hide("slide", {direction: "up"},200);
}