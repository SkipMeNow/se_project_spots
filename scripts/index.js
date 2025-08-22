const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const profileEditButton = document.querySelector("#edit-profile-button");
const editProfileModal = document.querySelector("#modal__edit-profile");
const editModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileForm = document.forms["edit-profile-form"];

const newPostButton = document.querySelector("#new-post-button");
const newPostModal = document.querySelector("#modal__new-post");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = document.forms["new-post-form"];
const newPostLinkInput = newPostForm.querySelector("#profile-image-input");
const newPostCaptionInput = newPostForm.querySelector("#profile-caption-input");
const buttonElement = newPostModal.querySelector(".modal__submit-btn");

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = document.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImageElement = document.querySelector(".modal__image");
const previewCaptionElement = document.querySelector(".modal__caption");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Profile Edit
profileEditButton.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  closeModal(editProfileModal);
  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post
newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const data = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };
  initialCards.push(data);
  const newCard = getCardElement(data);

  cardList.prepend(newCard);
  closeModal(newPostModal);
  newPostForm.reset();

  disabledButton(buttonElement, settings);
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((cardData) => renderCard(cardData, "append"));

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
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_active");
  });

  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
});

document.addEventListener("mousedown", (evt) => {
  const openedModal = document.querySelector(".modal.modal_opened");
  if (openedModal && evt.target === openedModal) {
    closeModal(openedModal);
  }
});
