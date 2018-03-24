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
        <span class="title"><a href="` + data[i].link + `" target="_blank">` + data[i].title + `</a></span>

        <a href="#!" class="secondary-content"><i class="material-icons">comment</i></a>
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
      <textarea id="bodyinput" name="body"></textarea>
      <button data-id="` + data._id + `" id="savenote">Submit comment</button>
      `;

      $(".notes").append(commentDiv);
    })
});
