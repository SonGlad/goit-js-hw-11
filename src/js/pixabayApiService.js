import axios from 'axios';
import Notiflix from 'notiflix';


const MY_API_KEY = '37183357-4a88867391e1f957a87f7d888';
const BASE_URL = 'https://pixabay.com/api/';


export default class DataAPIService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
    };
    
    async fetchArticles() {   
        const url = `${BASE_URL}/?key=${MY_API_KEY}&q=${this.searchQuery}&image_type=photo&
        orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
        
        const response = await axios.get(url);
            this.incrementPage();
            return response.data;
            // const { hits, totalHits } = response.data;
            // return { hits, totalHits };
    };

    setSearchValue(query) {
        this.searchQuery = query;
    };

    incrementPage(){
        this.page += 1;
    };

    resetPage(){
        this.page = 1;
    };
};