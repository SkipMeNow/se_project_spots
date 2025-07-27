const profileName = document.querySelector(".profile__name")
const profileDescription = document.querySelector(".profile__description")

const profileEditButton = document.querySelector("#edit-profile-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");
const editProfileForm = editProfileModal.querySelector(".modal__form")

const newPostButton = document.querySelector("#new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostNameInput = newPostForm.querySelector("#profile-image-input");
const newPostCaptionInput = newPostForm.querySelector("#profile-caption-input");


// Profile Edit
profileEditButton.addEventListener("click", function(){
  editProfileModal.classList.add("modal_is-opened");
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
});

editModalCloseButton.addEventListener("click", function(){
  editProfileModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt){
  evt.preventDefault();
  editProfileModal.classList.remove("modal_is-opened");
  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post
newPostButton.addEventListener("click", function(){
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function(){
  newPostModal.classList.remove("modal_is-opened");
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(newPostNameInput.value);
  console.log(newPostCaptionInput.value);
  newPostModal.classList.remove("modal_is-opened");
}

newPostForm.addEventListener('submit', handleAddCardSubmit);
