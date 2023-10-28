document.addEventListener("click", (e) => {
  const btnToWatch = e.target.closest(".arvb-nav__menu-btn");
  console.log("btnToWatch:", btnToWatch);

  const containerToWatch = e.target.closest(".open");
  console.log("containerToWatch:", containerToWatch);

  const sideBarContainer = document.querySelector(".arvb-nav__sidebar");
  const btn = document.querySelector(".arvb-nav__menu-btn i");

  if (btnToWatch) {
    sideBarContainer.classList.toggle("open");

    btn.classList != "bi bi-x-lg"
      ? (btn.classList = "bi bi-x-lg")
      : (btn.classList = "bi bi-list");
  }

  if (!containerToWatch && !btnToWatch) {
    sideBarContainer.classList.remove("open");
    btn.classList = "bi bi-list";
  }
});
