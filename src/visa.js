document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.querySelector(".card-container");
  const visaCards = document.querySelectorAll(".visa-card");

  visaCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("apply-now-button")) {
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const clonedCard = card.cloneNode(true);

      clonedCard.classList.add("enlarged");
      clonedCard.style.top = `${cardRect.top}px`;
      clonedCard.style.left = `${cardRect.left}px`;
      clonedCard.style.width = `${cardRect.width}px`;
      clonedCard.style.height = `${cardRect.height}px`;

      cardContainer.appendChild(clonedCard);

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      cardContainer.appendChild(overlay);

      setTimeout(() => {
        clonedCard.style.top = "50%";
        clonedCard.style.left = "50%";
        clonedCard.style.width = "80vw";
        clonedCard.style.height = "80vh";
        clonedCard.style.transform = "translate(-50%, -50%)";
      }, 10);

      overlay.addEventListener("click", () => {
        clonedCard.style.top = `${cardRect.top}px`;
        clonedCard.style.left = `${cardRect.left}px`;
        clonedCard.style.width = `${cardRect.width}px`;
        clonedCard.style.height = `${cardRect.height}px`;
        clonedCard.style.transform = "translate(0, 0)";

        setTimeout(() => {
          cardContainer.removeChild(clonedCard);
          cardContainer.removeChild(overlay);
        }, 300);
      });
    });
  });
});