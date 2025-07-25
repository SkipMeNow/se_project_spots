const profileEditButton = document.querySelector("#edit-profile-button");
const newPostButton = document.querySelector("#new-post-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton = editProfileModal.querySelector(".modal__close-btn");

const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");

profileEditButton.addEventListener("click", function(){
  editProfileModal.classList.add("modal_is-opened");
});

editModalCloseButton.addEventListener("click", function(){
  editProfileModal.classList.remove("modal_is-opened");
});

newPostButton.addEventListener("click", function(){
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function(){
  newPostModal.classList.remove("modal_is-opened");
});