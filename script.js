$(document).ready(reloadCards);

$("#idea-container").on("click", ".remove-button", removeCard);

$("#save-button").on("click", clickSaveButton);

function IdeaCard(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
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
    <article class="idea-card" id="${ideaCard.id}">
      <h2 class="idea-card-title">${ideaCard.title}<button class="remove-button" type="button" name="button"></button></h2>
      <p class="idea-card-body">${ideaCard.body}</p>
      <div class="button-container">
        <button class="upvote" type="button" name="button"></button>
        <button class="downvote" type="button" name="button"></button>
        <p class="quality-text">quality: swill</p>
      </div>
    </article>`);
}

function storeCard(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function retrieveCard(ideaID) {
  JSON.parse(localStorage.getItem(ideaID));
  console.log(  JSON.parse(localStorage.getItem(ideaID)));
}

function reloadCards() {
  for (var i = 0; i < localStorage.length; i++) {
    createCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

function removeCard() {
  var ideaID = $(this).closest(".idea-card").attr("id");
  $(this).closest(".idea-card").remove();
  removeCardFromStorage(ideaID);
}

function removeCardFromStorage(ideaID) {
  localStorage.removeItem(ideaID);
}
