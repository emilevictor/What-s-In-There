
function generateRoomSelect(buildingID) {
	if(buildingID=="null") {
		$('#roomSelect').empty();
	} else {
		$.ajax({
			url:"http://rota.eait.uq.edu.au/building/"+buildingID+"/rooms.xml",
			dataType: 'text',
			success: function(data) {
				xmlDoc = $.parseXML(data);
				$xml = $(xmlDoc)
				$('#roomSelect').empty();
				$('#roomSelect').append('<option value="null">Select a room</option>')
				$xml.find('room').each(function() {
					$('#roomSelect').append('<option value="'+$(this).text()+'">'+$(this).text()+'</option>');
				});
			}
		});
	}
}
