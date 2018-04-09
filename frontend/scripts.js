var API_ENDPOINT = "https://tmzypn5ot0.execute-api.us-east-1.amazonaws.com/dev"

document.getElementById("storeButton").onclick = function(){

	var inputData = {
		"user": $('#userSelected option:selected').val(),
		"time" : $("#datetimepicker6").data("DateTimePicker").date(),
		"text" : $('#postText').val()
	};
	
	//var debugData = JSON.stringify(inputData);
	//alert(debugData);

	$.ajax({
	      url: API_ENDPOINT,
	      type: 'POST',
	      data:  JSON.stringify(inputData)  ,
	      contentType: 'application/json; charset=utf-8',
	      success: function (response) {
					document.getElementById("postIDreturned").textContent="Post ID: " + response;
	      },
	      error: function () {
	          alert("error");
	      }
	  });
}


document.getElementById("searchButton").onclick = function(){
	
	var postIdSearch = $('#postIdSearch').val();
	var usernameSearch = $('#usernameSearch').val();
	var timeSearch = $('#timeSearch').val();

	$.ajax({
				url:  API_ENDPOINT + '?postId='+postIdSearch + '&user='+usernameSearch + '&time='+timeSearch,
				type: 'GET',
				success: function (response) {

					$('#posts tr').slice(1).remove();

	        jQuery.each(response, function(i,data) {

						$("#posts").append("<tr> \
								<td>" + data['id'] + "</td> \
								<td>" + data['user'] + "</td> \
								<td>" + data['time'] + "</td> \
								<td>" + data['text'] + "</td> \
								</tr>");
	        });
				},
				error: function () {
						alert("error");
				}
		});
}

document.getElementById("postText").onkeyup = function(){
	var length = $(postText).val().length;
	document.getElementById("charCounter").textContent="Characters: " + length;
}

$(document).ready(function() {
    $(function () {
        $('#datetimepicker6').datetimepicker();
    });
});
