import DataAPIService from './js/pixabayApiService';
import TemplateArticles from './templates/articles.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});


const refs = {
    formEl: document.querySelector("#search-form"),
    divGalleryEl: document.querySelector(".gallery"),
    btnLoadEl: document.querySelector(".load-more")
};

const newDataAPIService = new DataAPIService();

refs.formEl.addEventListener('submit', onSubmit);
refs.btnLoadEl.addEventListener('click', onLoadMore);


function onSubmit(event){
    event.preventDefault();
    disableSearchMoreBtn();
    
    const dataAPIService = event.currentTarget.elements.seartchQuery.value.trim();
    
    if(dataAPIService === ''){
        Notiflix.Report.warning('Please fill in the input field');
        return; 
    }
    Notiflix.Loading.circle('Loading data, please wait...');
    newDataAPIService.setSearchValue(dataAPIService);
    newDataAPIService.resetPage();
    resetContent();
    generateFetchArticlesMarkup();
};


async function generateFetchArticlesMarkup(){
    try {
        const { hits, totalHits } = await newDataAPIService.fetchArticles();
        Notiflix.Loading.remove();
        if(hits.length === 0){
            Notiflix.Report.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        searchMove();
        setTimeout(() => {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            enableSearchMoreBtn();
            firstPageCheckForAmount(totalHits);
            appendCreatedMarkup(hits);
        }, 450);
    } catch (error) {
        notiflixForErrorReport(error);
    }
};


async function onLoadMore(){
    disableSearchMoreBtn();
    Notiflix.Loading.circle('Loading data, please wait...');
        try {
            const { hits, totalHits } = await newDataAPIService.fetchArticles();
            Notiflix.Loading.remove();
            enableSearchMoreBtn();
            pageCheckForNotification({ hits, totalHits });
            pageScroll();
        } catch (error) {
            notiflixForErrorReport(error);
        }
};


function appendCreatedMarkup(hits){
    refs.divGalleryEl.insertAdjacentHTML('beforeend', TemplateArticles(hits));
    lightbox.refresh();
};


function firstPageCheckForAmount(totalHits){
    const amountPerPage = newDataAPIService.perPage;
    if(totalHits <= amountPerPage){
        disableSearchMoreBtn();
        Notiflix.Notify.info(`We're sorry, but there are only ${totalHits} images as per your request
        & this is the end of the search result`, {
            timeout: 8000,
        });
        return;
    }    
};


function pageCheckForNotification({ hits , totalHits }){
    const nextPage = newDataAPIService.page;
    const amountPerPage = newDataAPIService.perPage;
    const currentPage = newDataAPIService.page - 1;
    const maxPage = Math.ceil(totalHits / amountPerPage);
    
    if(nextPage > maxPage){       
        appendCreatedMarkup(hits);
        disableSearchMoreBtn();
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    } else {
        const watched = currentPage * amountPerPage;
        const remaining = totalHits - watched;
        appendCreatedMarkup(hits);
        Notiflix.Notify.success(`Hooray! You successfully upload & ${watched} images already. 
        ${remaining} images to go. Do not Stop!`);
    }
};


function pageScroll(){
    const { height: cardHeight } = 
      refs.divGalleryEl.firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
      top: cardHeight * 1,
      behavior: "smooth",
    });
};

function resetContent(){
    refs.divGalleryEl.innerHTML = '';
};

function enableSearchMoreBtn(){
    refs.btnLoadEl.classList.remove('is-hidden');
};

function disableSearchMoreBtn(){
    refs.btnLoadEl.classList.add('is-hidden');
};

function notiflixForErrorReport(error){
    Notiflix.Loading.remove();
    Notiflix.Report.failure("ERROR", error.message);
    throw new error;
};

function searchMove(){
    refs.formEl.classList.remove('search-move');
}