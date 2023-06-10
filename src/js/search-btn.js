export {showSearchBtn, hideSearchBtn};

const refs = {
    btnOpenEl: document.querySelector(".search-button"),
    btnSearchEl: document.querySelector(".search-submit"),
    divCloseEl: document.querySelector(".search-close"),
};

refs.btnOpenEl.addEventListener('click', showSearchBtn);
refs.divCloseEl.addEventListener('click', hideSearchBtn);

function showSearchBtn(){
    setTimeout(() => {
        refs.btnSearchEl.classList.add('show');
    }, 1450); 
};

function hideSearchBtn(){
    refs.btnSearchEl.classList.remove('show');
};

