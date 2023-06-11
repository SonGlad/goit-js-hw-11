import DataAPIService from './js/pixabayApiService'
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import axios from 'axios';
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    formEl: document.querySelector("#search-form"),
    divGalleryEl: document.querySelector(".gallery"),
    btnLoadEl: document.querySelector(".load-more")
};

const newDataAPIService = new DataAPIService();

refs.formEl.addEventListener('submit', onSubmit);
refs.btnLoadEl.addEventListener('click', onLoadMore);

refs.btnLoadEl.classList.add('is-hidden');


function onSubmit(event){
    event.preventDefault();
    disableSearchMoreBtn();

    // newDataAPIService.query = event.currentTarget.elements.seartchQuery.value;
    const dataAPIService = event.currentTarget.elements.seartchQuery.value;
    
    if(dataAPIService === ''){
        Notiflix.Report.warning('Please fill in the input field');
        return; 
        }
        Notiflix.Loading.circle('Loading data, please wait...');
        newDataAPIService.setSearchValue(dataAPIService);
        newDataAPIService.resetPage();
        resetContent();

      
    newDataAPIService.fetchArticles()
    .then(({ hits , totalHits }) => {
        Notiflix.Loading.remove();
        if(hits.length === 0){
            Notiflix.Report.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
            appendCreatedMarkup(hits);
            enableSearchMoreBtn();
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`); 
    })
    .catch(error => {
        notiflixForErrorReport(error);
      });
};

function onLoadMore(){
    Notiflix.Loading.circle('Loading data, please wait...');
    newDataAPIService.fetchArticles()
    .then(({ hits , totalHits }) => {
        Notiflix.Loading.remove();
        pageCheckForNotification({ hits , totalHits });
    })
    .catch(error => {
        notiflixForErrorReport(error);
      });
};

function pageCheckForNotification({ hits , totalHits }){
    const nextPage = newDataAPIService.page;
    const maxPage = Math.ceil(totalHits / 40);

    if(nextPage > maxPage){
        appendCreatedMarkup(hits);
        disableSearchMoreBtn();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    } else {
        appendCreatedMarkup(hits);
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
};


function createMarkup(hits){
    return  hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
                        <a class="picture" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" width="300px" height ="200px" loading="lazy"/>
                        </a>
                        <div class="info">
                            <p class="title"><strong>Tags:</strong> ${tags}</p>
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


function appendCreatedMarkup(hits){
    const createdMarkup = createMarkup(hits);
    refs.divGalleryEl.insertAdjacentHTML('beforeend', createdMarkup );
    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
    });
    pageScroll();
    lightbox.refresh();
};


function pageScroll(){
    const { height: cardHeight } = 
      refs.divGalleryEl.firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
      top: cardHeight * 0.5,
      behavior: "smooth",
    });
};

function resetContent(){
    refs.divGalleryEl.innerHTML = '';
};

function enableSearchMoreBtn(){
    refs.btnLoadEl.classList.remove('is-hidden')
};

function disableSearchMoreBtn(){
    refs.btnLoadEl.classList.add('is-hidden')
};

function notiflixForErrorReport(error){
    Notiflix.Loading.remove();
    Notiflix.Report.failure('Error fetching breeds:', error);
    throw error;
};
