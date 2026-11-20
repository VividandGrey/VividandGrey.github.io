// Artwork Data
const artworks = [
  {
    label: "[1/5] PRELUDE",
    modalTitle: "PRELUDE",
    image: "prelude.jpg",
    details: "Gallery-framed oil painting • One-of-one",
    story: "The opening piece is rooted in chaotic entropy: A glowing anchor breaks through a sea of confusion, marking the dawn of conscious awakening.",
    modalImages: ["prelude-1.jpg", "prelude-2.jpg", "prelude-3.jpg", "prelude-4.jpg"]
  },
  {
    label: "[2/5] WITNESS",
    modalTitle: "WITNESS",
    image: "witness.jpg",
    details: "Gallery-framed oil painting • One-of-one",
    story: "The silent but powerful and watchful consciousness observes our unraveling and serves as the ultimate catalyst for change.",
    modalImages: ["witness-1.jpg", "witness-2.jpg", "witness-3.jpg", "witness-4.jpg"]
  },
  {
    label: "[3/5] TRANSILIENCE",
    modalTitle: "TRANSILIENCE",
    image: "transilience.jpg",
    details: "Gallery-framed oil painting • One-of-one",
    story: "The crucible's peak: A relentless internal push through grief and transformation, burning away the old self.",
    modalImages: ["transilience-1.jpg", "transilience-2.jpg", "transilience-3.jpg", "transilience-4.jpg"]
  },
  {
    label: "[4/5] EMBER",
    modalTitle: "EMBER",
    image: "ember.jpg",
    details: "Gallery-framed oil painting • One-of-one",
    story: "The immediate aftermath of the burst giving way to a new self.",
    modalImages: ["ember-1.jpg", "ember-2.jpg", "ember-3.jpg", "ember-4.jpg"]
  },
  {
    label: "[5/5] AFTERGLOW",
    modalTitle: "AFTERGLOW",
    image: "afterglow.jpg",
    details: "Gallery-framed oil painting • One-of-one",
    story: "The resolve: The calm after integration, embodying the expanded inner light that never leaves.",
    modalImages: ["afterglow-1.jpg", "afterglow-2.jpg", "afterglow-3.jpg", "afterglow-4.jpg"]
  }
];

let currentIndex = 0;

// Artwork Display & Navigation Elements
const imgDisplay = document.getElementById("paintingDisplay");
const modalTrigger = document.getElementById("modalTrigger");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Artwork Details Modal Elements
const artworkModal = document.getElementById("artworkModal");
const artworkModalCard = document.querySelector("#artworkModal .modal-card");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.querySelector("#artworkModal .modal-details");
const modalText = document.querySelector("#artworkModal .modal-text");
const modalGallery = document.getElementById("modalGallery");

// "Own a Piece" Modal Elements
const ownModalTrigger = document.getElementById("ownModalTrigger");
const ownModal = document.getElementById("ownModal");
const ownModalClose = document.getElementById("ownModalClose");

// Tracks whether a modal pushed a history state so swipe-back closes the modal
let modalHistoryOpen = false;

function pushModalHistory() {
  if (!modalHistoryOpen) {
    try {
      history.pushState({ modalOpen: true }, "");
      modalHistoryOpen = true;
    } catch (e) {}
  }
}

function popModalHistory() {
  if (modalHistoryOpen) {
    modalHistoryOpen = false;
    try {
      history.back();
    } catch (e) {}
  }
}

// Render Artwork with smooth fade
function updateArtwork(index) {
  imgDisplay.style.opacity = "0";

  setTimeout(() => {
    // Attach onload BEFORE changing src so cached images never miss the event
    imgDisplay.onload = () => {
      imgDisplay.style.opacity = "1";
    };

    imgDisplay.src = artworks[index].image;

    // Fallback in case the browser loads the cached image instantaneously
    if (imgDisplay.complete) {
      imgDisplay.style.opacity = "1";
    }

    // Scale down the 5th horizontal painting so it visually balances portrait pieces
    const canvasContainer = document.querySelector(".canvas-shadow");
    if (index === 4) {
      canvasContainer.classList.add("artwork-horizontal");
    } else {
      canvasContainer.classList.remove("artwork-horizontal");
    }

    modalTrigger.textContent = artworks[index].label;
    modalTitle.textContent = artworks[index].modalTitle;
    modalDetails.textContent = artworks[index].details;
    modalText.textContent = artworks[index].story;
  }, 200);
}

// Carousel Controls
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex === 0) ? artworks.length - 1 : currentIndex - 1;
  updateArtwork(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex === artworks.length - 1) ? 0 : currentIndex + 1;
  updateArtwork(currentIndex);
});

// Artwork Details Modal Handlers
function renderModalGallery(index) {
  modalGallery.innerHTML = "";
  const images = artworks[index].modalImages || [];

  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${artworks[index].modalTitle} view ${i + 1}`;
    modalGallery.appendChild(img);
  });
}

function openArtworkModal() {
  renderModalGallery(currentIndex);
  artworkModal.classList.add("active");
  artworkModal.setAttribute("aria-hidden", "false");
  artworkModalCard.scrollTop = 0;
  pushModalHistory();
}

function closeArtworkModal(fromPopState = false) {
  if (!artworkModal.classList.contains("active")) return;
  artworkModal.classList.remove("active");
  artworkModal.setAttribute("aria-hidden", "true");
  if (!fromPopState) popModalHistory();
}

modalTrigger.addEventListener("click", openArtworkModal);
imgDisplay.addEventListener("click", openArtworkModal);
modalClose.addEventListener("click", () => closeArtworkModal());
artworkModal.addEventListener("click", (e) => {
  if (e.target === artworkModal) closeArtworkModal();
});

// "Own a Piece" Modal Handlers
function openOwnModal() {
  ownModal.classList.add("active");
  ownModal.setAttribute("aria-hidden", "false");
  pushModalHistory();
}

function closeOwnModal(fromPopState = false) {
  if (!ownModal.classList.contains("active")) return;
  ownModal.classList.remove("active");
  ownModal.setAttribute("aria-hidden", "true");
  if (!fromPopState) popModalHistory();
}

ownModalTrigger.addEventListener("click", openOwnModal);
ownModalClose.addEventListener("click", () => closeOwnModal());
ownModal.addEventListener("click", (e) => {
  if (e.target === ownModal) closeOwnModal();
});

// Intercept phone swipe-back / browser Back button when a modal is open
window.addEventListener("popstate", () => {
  if (modalHistoryOpen) {
    modalHistoryOpen = false;
    closeArtworkModal(true);
    closeOwnModal(true);
  }
});

// Universal ESC key listener to close active modals
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeArtworkModal();
    closeOwnModal();
  }
});

// Parallax Layers
const brandGroup = document.querySelector(".brand-group");
const collectionGroup = document.querySelector(".collection-group");
const artExhibit = document.querySelector(".art-exhibit");
const footerFloor = document.querySelector(".gallery-floor");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Faster mobile vanish upwards so all top text clears cleanly
    if (brandGroup) {
      brandGroup.style.transform = `translate3d(0, ${scrolled * -1.8}px, 0)`;
      brandGroup.style.opacity = Math.max(0, 1 - scrolled / 95);
    }

    if (collectionGroup) {
      collectionGroup.style.transform = `translate3d(0, ${scrolled * -1.5}px, 0)`;
      collectionGroup.style.opacity = Math.max(0, 1 - scrolled / 135);
    }

    // Brings the artwork cleanly into full view after text vanishes
    if (artExhibit) {
      artExhibit.style.transform = `translate3d(0, ${scrolled * -0.4}px, 0)`;
    }

    if (footerFloor) {
      footerFloor.style.transform = `translate3d(0, ${scrolled * 0.04}px, 0)`;
    }
  } else {
    // Brand header parallax fade (Desktop)
    if (brandGroup) {
      brandGroup.style.transform = `translate3d(0, ${scrolled * -1.2}px, 0)`;
      brandGroup.style.opacity = Math.max(0, 1 - scrolled / 140);
    }

    // Description parallax fade (Desktop)
    if (collectionGroup) {
      collectionGroup.style.transform = `translate3d(0, ${scrolled * -0.85}px, 0)`;
      collectionGroup.style.opacity = Math.max(0, 1 - scrolled / 180);
    }

    // Exhibit subtle float (Desktop)
    if (artExhibit) {
      artExhibit.style.transform = `translate3d(0, ${scrolled * -0.12}px, 0)`;
    }

    // Floor perspective lock (Desktop)
    if (footerFloor) {
      footerFloor.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
    }
  }
}, { passive: true });