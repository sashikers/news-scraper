$.getJSON("/articles", function(data) {
  console.log("data", data);
  console.log("data.length", data.length);

  for (var i = 0; i < data.length; i++) {
    console.log("data[i].imageLink", data[i].imageLink);
    var articleDiv =
    `
    <li class="collection-item avatar">
      <img class="circle" src="` + data[i].imageLink + `">
      <span class="title">` + data[i].title + `</span><br>
      <span class="subtitle">` + data[i].subtitle + `</span>
    </li>
    `;

    $("#articleList").append(articleDiv);
  }
});
