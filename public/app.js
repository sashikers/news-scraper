$.getJSON("/articles", function(data) {
  console.log("data", data);
  console.log("data.length", data.length);

  for (var i = 0; i < data.length; i++) {
    console.log("data[i].imageLink", data[i].imageLink);
    var articleDiv =
    `
    <li class="collection-item avatar">
      <img class="circle" src="` + data[i].imageLink + `">
      <span class="title"><a href="` + data[i].link + `" target="_blank">` + data[i].title + `</a></span><br>
      <span class="subtitle">` + data[i].subtitle + `</span>
      <a href="#!" class="secondary-content"><i class="material-icons">comment</i></a>
    </li>
    `;

    $("#articleList").append(articleDiv);
  }
});
