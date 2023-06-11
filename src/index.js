import DataApiService from './js/pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    formEl: document.querySelector("#search-form"),
    inputEl: document.querySelector("#input"),
    btnSubmitEl: document.querySelector('button[type="submit"]'),
    divGalleryEl: document.querySelector(".gallery"),
    btnLoadEl: document.querySelector(".load-more")
};

const newDataApiService = new DataApiService();

refs.btnLoadEl.style.display = "none";

refs.btnSubmitEl.addEventListener('click', onSearch);
refs.btnLoadEl.addEventListener('click', onLoadMore);



function onSearch(event){
    event.preventDefault();

    newDataApiService.query = refs.inputEl.value;

    if(newDataApiService.query === ''){
        return alert('Please fill in the input field');
    };

    enableSearchMoreBtn();
    resetContent();
    newDataApiService.resetPage();
    newDataApiService.fetchArticles().then(appendCreatedMarkup);
};


function onLoadMore(){
    newDataApiService.fetchArticles().then(appendCreatedMarkup);

};


function createMarkup(hits){
    return hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
                    <a class="gallery__link" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" width="300px" height ="200px"loading="lazy"/>
                    </a>
                        <div class="info">
                            <h3 class="titel">Tags: ${tags}</h3>
                            <p class="info-item">
                                <b>Likes: ${likes}</b>
                            </p>
                            <p class="info-item">
                                <b>Views: ${views}</b>
                            </p>
                            <p class="info-item">
                                <b>Comments: ${comments}</b>
                            </p>
                            <p class="info-item">
                                <b>Downloads: ${downloads}</b>
                            </p></div></div>`
    }).join('');
};

// const lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionDelay: 300,
// });




function appendCreatedMarkup(hits){
    const createdMarkup = createMarkup(hits);
    refs.divGalleryEl.insertAdjacentHTML('beforeend', createdMarkup );
};

function resetContent(){
    refs.divGalleryEl.innerHTML = '';

};

function enableSearchMoreBtn(){
    refs.btnLoadEl.style.display = "block";
};












