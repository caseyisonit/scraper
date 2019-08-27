// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".comments-link", function () {
  console.log("bacon");
  // Empty the notes from the note section
  $(".notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // An input to enter a new title
      $(".notes" + thisId).append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(".notes" + thisId).append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".notes" + thisId).append("<button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        data.note.forEach(note => {
        $(".notes" + thisId).append(`<div class="addedComment"><h3 class="addedTitle">` + note.title + `</h3></div>`);
        // Place the body of the note in the body textarea
        $(".addedComment +").append(`<p class="addedBody">` + note.body + `</p>`);
      })
    };
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function (event) {
  // Grab the id associated with the article from the submit button
  event.preventDefault();
  
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $(".notes" + thisId).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
