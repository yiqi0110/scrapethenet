


// Whenever someone clicks a p tag
$(document).on("click", ".btn-primary", function (e) {
  console.log("hello, this is working");
  console.log(this.id);

    $.ajax({
      method: "GET",
      url: "/articles/" + this.id
    }).then((data)=>{
      // console.log(data);
      $("h5.modal-title").append(data.title);
      $("div.modal-body").append(data.preview);
      $("button.commentBtn").attr("id", data._id);
    });
    $("h5.modal-title").empty();
    $("div.modal-body").empty();
});

// When you click the savenote button
$(document).on("click", "button.commentBtn", function() {
  console.log(this.id);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + this.id,
      data: {
        // Value taken from title input
        comment: $("#commentInput").val(),
      }
    })
    // With that done
    .then((data) => {
      // Log the response
      console.log(data);
      // Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#commentInput").val("");
});