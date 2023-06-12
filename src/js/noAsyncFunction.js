import axios from 'axios';

const MY_API_KEY = '37183357-4a88867391e1f957a87f7d888';
const BASE_URL = 'https://pixabay.com/api/';


class DataAPIService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };
    
    fetchArticles() {   
        const url = `${BASE_URL}/?key=${MY_API_KEY}&q=${this.searchQuery}&image_type=photo&
        orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
 
        // AXIOS
        // return axios.get(url).then((response) => {
        //     this.incrementPage();
        //     const { hits , totalHits } = response.data;
        //     return { hits , totalHits };
        // });


        // FETCH
        // return fetch(url)
        //     .then(response => response.json()) 
        //     .then(({ hits , totalHits }) => {  
        //         this.incrementPage();
        //         return {hits, totalHits};
        //     })
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

    
    // get query() {
    //     return this.searchQuery;
    // };

    // set query(newQuery) {
    //     this.searchQuery = newQuery;
    // };

};