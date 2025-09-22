import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0af0ccaa-e2a8-4eec-9ca7-6e6751b01c1c",
    "Content-Type": "application/json",
  },
});

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const profileEditButton = document.querySelector("#edit-profile-button");
const editProfileModal = document.querySelector("#modal__edit-profile");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileForm = document.forms["edit-profile-form"];

const avatarEditButton = document.querySelector("#avatar-edit-button");
const updateAvatarModal = document.querySelector("#modal__update-avatar");
const updateAvatarForm = document.forms["update-avatar-form"];
const avatarUrlInput = updateAvatarForm.querySelector("#avatar-url-input");

const newPostButton = document.querySelector("#new-post-button");
const newPostModal = document.querySelector("#modal__new-post");
const newPostForm = document.forms["new-post-form"];
const newPostLinkInput = newPostForm.querySelector("#profile-image-input");
const newPostCaptionInput = newPostForm.querySelector("#profile-caption-input");

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

const previewModal = document.querySelector("#preview-modal");
const previewImageElement = document.querySelector(".modal__image");
const previewCaptionElement = document.querySelector(".modal__caption");

const deleteCardModal = document.querySelector("#modal__delete-card");
const deleteCardButton = deleteCardModal.querySelector(".delete-popup__submit-btn_type_delete");
const cancelDeleteButton = deleteCardModal.querySelector(".delete-popup__submit-btn_type_cancel");

// Variables to store the current selected card and its ID for deletion
let selectedCard = null;
let selectedCardId = null;

// Utility function to handle loading states
function renderLoading(isLoading, button, loadingText = "Saving...", originalText = "Save") {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Load both user information and cards from server
api
  .getAppData()
  .then(([userInfo, cards]) => {
    // 1. Update user profile information first
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
    profileAvatar.alt = userInfo.name;

    // 2. Then render cards from server
    cards.forEach((cardData) => renderCard(cardData, "append"));
  })
  .catch((err) => {
    console.error("Error loading app data:", err);
  });

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
  document.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
  document.removeEventListener("mousedown", handleOverlayClick);
}

// Profile Edit
profileEditButton.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = editProfileForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitButton, "Saving...", "Save");

  api
    .updateUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((updatedUserInfo) => {
      profileName.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Error updating user info:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Saving...", "Save");
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// Avatar Edit
avatarEditButton.addEventListener("click", function () {
  resetValidation(updateAvatarForm, settings);
  openModal(updateAvatarModal);
});

function handleUpdateAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = updateAvatarForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitButton, "Saving...", "Save");

  api
    .updateAvatar(avatarUrlInput.value)
    .then((updatedUserInfo) => {
      profileAvatar.src = updatedUserInfo.avatar;
      profileAvatar.alt = updatedUserInfo.name;
      closeModal(updateAvatarModal);
      updateAvatarForm.reset();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Saving...", "Save");
    });
}

updateAvatarForm.addEventListener("submit", handleUpdateAvatarSubmit);

// New Post
newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitButton = newPostForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitButton, "Saving...", "Save");

  const cardData = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };

  // Send POST request to server to create card
  api
    .createCard(cardData)
    .then((newCard) => {
      // Server returns the complete card object with _id, owner, etc.
      const cardElement = getCardElement(newCard);
      cardList.prepend(cardElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch((err) => {
      console.error("Error creating card:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Saving...", "Save");
    });
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

// Handle delete card click - stores card info and opens confirmation modal
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;     // Store the card element
  selectedCardId = data._id;      // Store the card's ID from server data
  openModal(deleteCardModal);     // Open the delete confirmation modal
}

// Handle delete confirmation submission
function handleDeleteSubmit() {
  renderLoading(true, deleteCardButton, "Deleting...", "Delete");

  api
    .deleteCard(selectedCardId)   // Pass the card ID to the API function
    .then(() => {
      selectedCard.remove();      // Remove the card from the DOM
      closeModal(deleteCardModal); // Close the modal
      selectedCard = null;        // Reset variables
      selectedCardId = null;
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
    })
    .finally(() => {
      renderLoading(false, deleteCardButton, "Deleting...", "Delete");
    });
}

// Delete card confirmation
deleteCardButton.addEventListener("click", handleDeleteSubmit);

// Cancel delete action
cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
  selectedCard = null;    // Reset the reference
  selectedCardId = null;
});

// Handle like/unlike card functionality
function handleLikeCard(likeButton, cardId) {
  // Check if card is currently liked by checking the active class
  const isLiked = likeButton.classList.contains("card__like-button_active");

  // Choose API method based on current like state
  const likeAction = isLiked ? api.dislikeCard(cardId) : api.likeCard(cardId);

  likeAction
    .then((updatedCard) => {
      // Update UI based on server response
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button_active");
      } else {
        likeButton.classList.remove("card__like-button_active");
      }
    })
    .catch((err) => {
      console.error("Error updating like status:", err);
    });
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  if (typeof cardList[method] === "function") {
    cardList[method](cardElement);
  } else {
    console.warn(`Invalid method "${method}" passed to renderCard.`);
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const titleElement = cardElement.querySelector(".card__title");
  const imageElement = cardElement.querySelector(".card__image");

  titleElement.textContent = data.name;
  imageElement.src = data.link;
  imageElement.alt = data.name;

  imageElement.addEventListener("click", () => {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  const cardLikeButton = cardElement.querySelector(".card__like-button");

  // Set initial like state based on server data
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardLikeButton.addEventListener("click", () => {
    handleLikeCard(cardLikeButton, data._id);
  });

  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  return cardElement;
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

enableValidation(settings);
