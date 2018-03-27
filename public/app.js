$.getJSON("/articles", function(data) {
  console.log("data", data);
  console.log("data.length", data.length);

  for (var i = 0; i < data.length; i++) {
    // var articleDiv =
    // `
    // <li class="collection-item avatar">
    //   <img class="circle" src="` + data[i].imageLink + `">
    //   <span class="title"><a href="` + data[i].link + `" target="_blank">` + data[i].title + `</a></span><br>
    //   <span class="subtitle">` + data[i].subtitle + `</span>
    //   <a href="#!" class="secondary-content"><i class="material-icons">comment</i></a>
    // </li>
    // `;

    var articleDiv =
    `
    <li class="collection-item avatar">
      <div class="collapsible-header" data-id="` + data[i]._id + `">
      <a href="#!" class="secondary-content"><i class="material-icons">comment</i></a>
        <span class="title"><a href="` + data[i].link + `" target="_blank">` + data[i].title + `</a></span>


      </div>
      <div class="collapsible-body">
        <div class="notes" data-id="` + data[i]._id + `" id="notes` + data[i]._id + `">butts</div>
      </div>
    </li>
    `;

    $("#articleList").append(articleDiv);
  }
});

$(document).on("click", ".collapsible-header", function() {
  $(".notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);

      var commentDiv =
      `
      <h4>Comments</h4>
      <div class="input-field">
        <input placeholder="Name" id="nameinput" name="username">
      </div>
      <div class="input-field">
        <textarea id="bodyinput" class="materialize-textarea" name="body" placeholder="Comments"></textarea>
      </div>

      <button data-id="` + data._id + `" id="savenote">Submit comment</button>
      <br><br>
      <div class="container existingNotes"></div>
      `;

      $(".notes").append(commentDiv);

      if (data.notes) {
        console.log(data.notes);
        for (var j = 0; j < data.notes.length; j++) {
          console.log("j", data.notes[j]);
          var existingCommentDiv =
          `
          <div class="existingCommentDiv">
            <span class="existingCommentName">` + data.notes[j].name + `</span> says: <span>` + data.notes[j].body + `</span>
          </div>
          `;

          $(".existingNotes").append(existingCommentDiv);
        }
        // $(".existingNotes").append(data.note.name + " says: " + data.note.body);
      };
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      name: $("#nameinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $(".notes").empty();
    });
});
