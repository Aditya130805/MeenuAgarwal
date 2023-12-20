
navbarButton = document.getElementsByClassName("collapsed_navbar")[0].children[0];
navbarContents = document.querySelector(".navbarContents");

window.onresize = window.onload = function() {
    if(this.innerWidth > 745){
        navbarContents.style.display = "flex";
        navbarContents.style.animation = "none";
    }
    else{
        navbarContents.style.display = "none";
        navbarButton.classList.remove("rotate_button");
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

let clickCount = 0;

navbarButton.addEventListener("click", () => {
    clickCount += 1;
    if (clickCount%2 != 0){
        navbarContents.style.display = "flex";
        navbarButton.classList.add("rotate_button");
        navbarContents.style.animation = "menu_animation 0.6s";
        delay(600).then(() => navbarContents.style.animation = "opacity_increase 0.6s");
    }
    else{
        navbarButton.classList.remove("rotate_button");
        navbarContents.style.animation = "menu_animation_reverse 0.6s forwards";
        delay(600).then(() => navbarContents.style.display = "none");
    }
})

