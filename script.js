$(document).ready(reloadCards);

$("#idea-container").on("click", ".remove-button", removeCard)
                    .on('click', ".downvote", downvote)
                    .on('click', '.upvote', upvote);
$("#save-button").on("click", clickSaveButton)
                 .on("click", disableSaveButton);
$("#title-input, #body-input").on("input", disableSaveButton);
$("#search-input").on("input", filterText);
$('#idea-container').on('blur', '.idea-card-title', saveChangesTitle)
                    .on('blur', '.idea-card-body', saveChangesBody);
$('#idea-container').on('keypress', '.idea-card-title', saveTitleOnClick);
$('#idea-container').on('keypress', '.idea-card-body', saveBodyOnClick);

function IdeaCard(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.qualities = ["swill", "plausible", "genius"];
  this.index = 0;
  this.quality = this.qualities[this.index];
}

function clickSaveButton() {
  event.preventDefault();
  var titleInput = $("#title-input").val();
  var bodyInput = $("#body-input").val();
  var newCard = new IdeaCard(titleInput, bodyInput);
  createCard(newCard);
  storeCard(newCard);
  clearInputFields();
}

function clearInputFields() {
  $("#title-input, #body-input").val("");
}

function createCard(ideaCard) {
  $("#idea-container").prepend(`
    <article role="article" class="idea-card" id="${ideaCard.id}">
      <h2 class="idea-card-title" contenteditable="true">${ideaCard.title}<button class="remove-button" type="button" name="button" contenteditable="false"></button></h2>
      <p class="idea-card-body" contenteditable="true">${ideaCard.body}</p>
      <div class="button-container">
        <button class="upvote" type="button" name="button"></button>
        <button class="downvote" type="button" name="button"></button>
        <p class="quality-text">quality: ${ideaCard.quality}</p>
      </div>
    </article>`);
}

function reloadCards() {
  for (var i = 0; i < localStorage.length; i++) {
    createCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

function storeCard(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function setItemLocal(id, idea) {
  localStorage.setItem(id, JSON.stringify(idea));
}

function removeCardFromStorage(ideaID) {
  localStorage.removeItem(ideaID);
}

function removeCard() {
  var ideaID = $(this).closest(".idea-card").attr("id");
  $(this).closest(".idea-card").remove();
  removeCardFromStorage(ideaID);
}

function retrieveCard(ideaID) {
  var parsedObject = JSON.parse(localStorage.getItem(ideaID));
  return [parsedObject, parsedObject.qualities, parsedObject.index, parsedObject.quality];
}

function upvote() {
  var ideaId = ($(this).closest(".idea-card").attr("id"));
  var idea = retrieveCard(ideaId);
  if (idea[2] === idea[1].length - 1) {
    return;
  }
  idea[2]++;
  idea[0].quality = idea[1][idea[2]];
  idea[0].index = idea[2];
  setItemLocal(ideaId, idea[0]);
  $(this).siblings('.quality-text').text("quality: " + idea[1][idea[2]]);
}

function downvote() {
  var ideaId = ($(this).closest(".idea-card").attr("id"));
  var idea = retrieveCard(ideaId);
  if (idea[2] === 0) {
    return;
  }
  idea[2]--;
  idea[0].quality = idea[1][idea[2]];
  idea[0].index = idea[2];
  setItemLocal(ideaId, idea[0]);
  $(this).siblings('.quality-text').text("quality: " + idea[1][idea[2]]);
}

function disableSaveButton() {
  var titleInput = $("#title-input").val();
  var bodyInput = $("#body-input").val();
  if (titleInput !== "" && bodyInput !== "" ) {
    $("#save-button").prop("disabled", false);
  } else if (titleInput === "" && bodyInput === "") {
    $("#save-button").prop("disabled", true);
  }
}

function filterText() {
  var searchInput = $(this).val().toLowerCase();
  $(".idea-card").each(function() {
    var ideaText = $(this).text().toLowerCase();
    if(ideaText.indexOf(searchInput) !== -1) {
      $(this).show();
    }
    else {
      $(this).hide();
    }
  })
}

function saveTitleOnClick(event) {
  var ideaID = ($(this).closest(".idea-card").attr("id"));
  var ideaObject = retrieveCard(ideaID);
  if(event.keyCode === 13) {
    event.preventDefault();
    var newIdeaObjectTitle = $(this).closest(".idea-card-title").text();
    ideaObject[0].title = newIdeaObjectTitle;
    setItemLocal(ideaID, ideaObject[0]);
    $('.idea-card-title').blur();
  }
}

function saveBodyOnClick(event) {
  var ideaID = ($(this).closest(".idea-card").attr("id"));
  var ideaObject = retrieveCard(ideaID);
  if(event.keyCode === 13) {
    event.preventDefault();
    var newIdeaObjectBody = $(this).closest(".idea-card-body").text();
    ideaObject[0].body = newIdeaObjectBody;
    setItemLocal(ideaID, ideaObject[0]);
    $('.idea-card-body').blur();
  }
}

function saveChangesTitle() {
  var ideaID = ($(this).closest(".idea-card").attr("id"));
  var ideaObject = retrieveCard(ideaID);
  var newIdeaObjectTitle = $(this).closest(".idea-card-title").text();
  ideaObject[0].title = newIdeaObjectTitle;
  setItemLocal(ideaID, ideaObject[0]);
}

function saveChangesBody() {
  var ideaID = ($(this).closest(".idea-card").attr("id"));
  var ideaObject = retrieveCard(ideaID);
  var newIdeaObjectBody = $(this).closest(".idea-card-body").text();
  ideaObject[0].body = newIdeaObjectBody;
  setItemLocal(ideaID, ideaObject[0]);
}
