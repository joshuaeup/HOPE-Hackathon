const infoNav = document.querySelector(".overlay");
const infoContents = document.querySelectorAll(".home-grid-container__item");
const infoTitle = document.querySelector(".home-grid-container__title");
const open = document.querySelector(".nav__icon");

const toggle = (event) => {
    event.preventDefault();
    infoNav.classList.toggle("change");
    infoTitle.classList.toggle("display");
    infoTitle.classList.toggle("hide");
    for (let i = 0; i < infoContents.length; i++) {
        infoContents[i].classList.toggle("display");
        infoContents[i].classList.toggle("hide");
    }

    open.classList.toggle("rotate");
    if (infoNav.classList.contains("change")) {
        open.classList.remove("fa-chevron-circle-right");
        open.classList.add("fa-times-circle");
    } else {
        open.classList.add("fa-chevron-circle-right");
        open.classList.remove("fa-times-circle");
    }
};
