
const slider = document.getElementById('slider')

var buttonArr = []
const numButtons = 3
for (let i=0; i<numButtons; i++){
    buttonArr.push(document.getElementById('button' + String(i+1)))
}

for (let i=0; i<buttonArr.length; i++){
    buttonArr[i].onclick = function(){
        slider.style.transform = "translateX(" + String(i*-100) + "%)"
        buttonArr[i].classList.add("button_active")
        for (let j=0; j<buttonArr.length; j++){
            if (j!=i){
                buttonArr[j].classList.remove("button_active")
            }
        }
    }
}


// FAQs

const faqs = document.querySelectorAll('.faq')
faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("faqActive")
    })
})