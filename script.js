$(document).ready(reloadCards);

$("#idea-container").on("click", ".remove-button", removeCard)
                    .on('click', ".downvote", downvote)
                    .on('click', '.upvote', upvote);
$("#save-button").on("click", clickSaveButton)
                 .on("click", disableSaveButton);
$("#title-input, #body-input").on("input", disableSaveButton);
$("#search-input").on("input", filterText);
$("#idea-card-boyd").on("input", )

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
  console.log('yo');
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
      <h2 class="idea-card-title" contenteditable="true">${ideaCard.title}<button class="remove-button" type="button" name="button" contenteditable="false"></button></h2>
      <p class="idea-card-body" contenteditable="true">${ideaCard.body}</p>
      <div class="button-container">
        <button class="upvote" type="button" name="button"></button>
        <button class="downvote" type="button" name="button"></button>
        <p class="quality-text">quality:${ideaCard.quality}</p>
      </div>
    </article>`);
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

function setItemLocal(id, idea) {
  localStorage.setItem(id, JSON.stringify(idea));
}

function retrieveCard(ideaID) {
  var parsedObject = JSON.parse(localStorage.getItem(ideaID));
  return [parsedObject, parsedObject.qualities, parsedObject.index, parsedObject.quality];
}

function storeCard(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function upvote() {
  var ideaId = ($(this).closest(".idea-card").attr("id"));
  var idea = retrieveCard(ideaId);
  console.log(idea);
  if (idea[2] == idea[1].length - 1) {
    return;
  }
  idea[2]++;
  idea[0].quality = idea[1][idea[2]];
  idea[0].index = idea[2];
  setItemLocal(ideaId, idea[0]);
  $(this).siblings('.quality-text').text("quality: " + " " + idea[1][idea[2]]);
}

function downvote() {
  var ideaId = ($(this).closest(".idea-card").attr("id"));
  var idea = retrieveCard(ideaId);
  console.log(idea);
  if (idea[2] === 0) {
    return;
  }
  idea[2]--;
  idea[0].quality = idea[1][idea[2]];
  idea[0].index = idea[2];
  setItemLocal(ideaId, idea[0]);
  $(this).siblings('.quality-text').text("quality: " + " " + idea[1][idea[2]]);
}

function disableSaveButton() {
  var titleInput = $("#title-input").val();
  var bodyInput = $("#body-input").val();
  if (titleInput != "" && bodyInput != "" ) {
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
      console.log(this);
    }
    else {
      $(this).hide();
      console.log(this);
    }
  })
  }
  // trying to call saveChanges function when enter button is pressed while editing idea-card-body
// $('#idea-container').on('keypress', '.idea-card-body', function(event) {
//      event.preventDefault();
//      if(event.keyCode === 13) {
//      console.log("hello");
//      saveChanges();
//    }
//   })

$('#idea-container').on('blur', '.idea-card-title', saveChanges)
                    .on('blur', '.idea-card-body', saveChanges);


function saveChanges() {
  // declare variable for idea card's id
  var ideaID = ($(this).closest(".idea-card").attr("id"));
  // use retrieveCard function with idea card's id as argument to retrieve object and set that to a variable
  var ideaObject = retrieveCard(ideaID);
  // set variable.title = new input in idea card body and idea card title
  var newIdeaObjectBody = $(".idea-card-body").text();
  var newIdeaObjectTitle = $(".idea-card-title").text();
  ideaObject[0].body = newIdeaObjectBody;
  ideaObject[0].title = newIdeaObjectTitle;
  setItemLocal(ideaID, ideaObject[0]);
  //
}
