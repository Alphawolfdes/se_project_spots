import "./index.css";
import {
  settings,
  resetValidation,
  toggleButtonState,
  enableValidation,
  validationConfig,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import { set } from "core-js/core/dict";
document.addEventListener("DOMContentLoaded", () => {
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

  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "9ebf8a9d-8c21-4a99-96a3-9fee3d87955f",
      "Content-Type": "application/json",
    },
  });

  //Destructure the second item in the callback of the .then()

  api
    .getAppInfo()
    .then(([userInfo, cards]) => {
      // Set user info
      const avatarEl = document.querySelector(".profile__avatar");
      if (avatarEl && userInfo.avatar) {
        avatarEl.src = userInfo.avatar;
      }
      profileNameEl.textContent = userInfo.name;
      profileDescriptionEl.textContent = userInfo.about;

      // Render cards
      cards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.append(cardElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });

  const previewModal = document.querySelector("#preview-modal");
  const previewCloseBtn = previewModal.querySelector(
    ".modal__close-btn_type_preview"
  );

  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const editProfileCloseBtn =
    editProfileModal.querySelector(".modal__close-btn");
  const editProfileForm = editProfileModal.querySelector(".modal__form");
  const editProfileNameInput = editProfileModal.querySelector(
    "#profile-name-input"
  );
  const editProfileDescriptionInput = editProfileModal.querySelector(
    "#profile-description-input"
  );

  //avatar form elements
  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = avatarModal.querySelector(".modal__form");
  const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
  const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
  const avatarInput = avatarModal.querySelector("#profile-avatar-input");

  const newPostBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

  const profileNameEl = document.querySelector(".profile__name");
  const profileDescriptionEl = document.querySelector(".profile__description");

  const previewImageEl = previewModal.querySelector(".modal__image");
  const previewCaptionEl = previewModal.querySelector(".modal__caption");

  // delete form elements
  const deleteModal = document.querySelector("#delete-modal");
  const deleteForm = deleteModal.querySelector("#delete-form");

  const cardTemplate = document
    .querySelector("#card-template")
    .content.querySelector(".card");
  const cardsList = document.querySelector(".cards__list");

  const avatarModalBtn = document.querySelector(".profile__avatar-btn");

  // Store the currently selected card and its ID for deletion
  let selectedCard = null;
  let selectedCardId = null;

  function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardSubmitButton = cardElement.querySelector(".modal__button");
    const cardImageEl = cardElement.querySelector(".card__image");

    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardTitleEl.textContent = data.name;

    cardImageEl.addEventListener("click", () => {
      previewImageEl.src = data.link;
      previewImageEl.alt = data.name;
      previewCaptionEl.textContent = data.name;
      openModal(previewModal);
    });

    const cardLikeBtn = cardElement.querySelector(".card__like-button");
    cardLikeBtn.addEventListener("click", () => {
      const isActive = cardLikeBtn.classList.contains(
        "card__like-button_active"
      );
      const cardId = data._id;
      if (!isActive) {
        api
          .likeCard(cardId)
          .then((updatedCard) => {
            cardLikeBtn.classList.add("card__like-button_active");
          })
          .catch(console.error);
      } else {
        api
          .unlikeCard(cardId)
          .then((updatedCard) => {
            cardLikeBtn.classList.remove("card__like-button_active");
          })
          .catch(console.error);
      }
    });

    const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
    cardDeleteBtn.addEventListener("click", (evt) =>
      handleDeleteCard(cardElement, data)
    );

    return cardElement;
  }

  function openModal(modal) {
    modal.classList.add("modal_is-opened");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_is-opened");
    document.removeEventListener("keydown", handleEscClose);
  }

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      const openedModal = document.querySelector(".modal_is-opened");
      if (openedModal) {
        closeModal(openedModal);
      }
    }
  }
  editProfileBtn.addEventListener("click", function () {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    resetValidation(
      editProfileForm,
      [editProfileNameInput, editProfileDescriptionInput],
      settings
    );
    openModal(editProfileModal);
  });

  editProfileCloseBtn.addEventListener("click", function () {
    closeModal(editProfileModal);
  });

  newPostBtn.addEventListener("click", function () {
    openModal(newPostModal);
  });

  newPostCloseBtn.addEventListener("click", function () {
    closeModal(newPostModal);
  });

  previewCloseBtn.addEventListener("click", function () {
    closeModal(previewModal);
  });

  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("modal")) {
        closeModal(modal);
      }
    });
  });

  function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    const submitBtn = editProfileForm.querySelector(
      settings.submitButtonSelector
    );
    setButtonText(submitBtn, true, "Saving...", "Save");
    api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      })
      .catch(console.error)
      .finally(() => {
        setButtonText(submitBtn, false, "Saving...", "Save");
      });
  }

  const newPostForm = newPostModal.querySelector(".modal__form");
  const cardImageInput = newPostModal.querySelector("#card-image-input");
  const cardCaptionInput = newPostModal.querySelector(
    "#caption-description-input"
  );

  function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const cardSubmitButton = newPostForm.querySelector(
      settings.submitButtonSelector
    );
    setButtonText(cardSubmitButton, true, "Saving...", "Save");
    const inputValues = {
      name: cardCaptionInput.value,
      link: cardImageInput.value,
    };

    // If you want to use API to add card, replace below with api.addCard(inputValues)
    // For now, just add locally
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    closeModal(newPostModal);
    newPostForm.reset();
    toggleButtonState(
      [cardImageInput, cardCaptionInput],
      cardSubmitButton,
      settings
    );
    setButtonText(cardSubmitButton, false, "Saving...", "Save");
  }
  // finish the avatar submit handler
  function handleAvatarSubmit(evt) {
    evt.preventDefault();
    const avatarSubmitBtn = evt.submitter;
    setButtonText(avatarSubmitBtn, true, "Saving...", "Save");
    api
      .editAvatarUserInfo({
        avatar: avatarInput.value,
      })
      .then((data) => {
        const avatarEl = document.querySelector(".profile__avatar");
        if (avatarEl && data.avatar) {
          avatarEl.src = data.avatar;
        }
        closeModal(avatarModal);
        avatarForm.reset();
        toggleButtonState([avatarInput], avatarSubmitBtn, settings);
      })
      .catch(console.error)
      .finally(() => {
        setButtonText(avatarSubmitBtn, false, "Saving...", "Save");
      });
  }

  function handleDeleteCard(cardElement, _cardID) {
    selectedCard = cardElement;
    selectedCardId = _cardID;
    openModal(deleteModal);
  }

  function handleDeleteSubmit(evt) {
    evt.preventDefault();
    const deleteSubmitBtn = deleteForm.querySelector(
      settings.submitButtonSelector
    );
    setButtonText(deleteSubmitBtn, true, "Deleting...", "Yes");
    api
      .deleteCard(selectedCardId)
      .then(() => {
        if (selectedCard) {
          selectedCard.remove();
        }
        closeModal(deleteModal);
        selectedCard = null;
        selectedCardId = null;
      })
      .catch(console.error)
      .finally(() => {
        setButtonText(deleteSubmitBtn, false, "Deleting...", "Yes");
      });
  }

  deleteForm.addEventListener("submit", handleDeleteSubmit);

  enableValidation(validationConfig);
});
