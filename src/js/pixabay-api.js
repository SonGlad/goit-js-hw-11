const MY_API_KEY = '37183357-4a88867391e1f957a87f7d888';
const BASE_URL = 'https://pixabay.com/api/';

export default class DataApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };
    
    fetchArticles() {
    
        const url = `${BASE_URL}/?key=${MY_API_KEY}&q=${this.searchQuery}&image_type=photo&
        orientation=horizontal&safesearch=true&page=${this.page}&per_page=5`;
    
        return fetch(url)
            .then(responce => responce.json())
            .then(({ hits }) => {
                this.incrementPage();

                return hits;
            });
    };

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };

    incrementPage(){
        this.page += 1;
    };

    resetPage(){
        this.page = 1;
    };
};