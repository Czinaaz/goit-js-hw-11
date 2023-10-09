import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = '39928723-f6b1546c2ba029a098dc6a39a'; // Zastąp tym swoim kluczem dostępu do Pixabay API
const perPage = 40;
let currentPage = 1;
let currentSearchQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const fetchImages = async (query, page) => {
    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: page,
                per_page: perPage,
            },
        });

        return response.data.hits;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

const clearGallery = () => {
    gallery.innerHTML = '';
};

const createImageCard = (image) => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(info);

    return card;
};

const appendImagesToGallery = (images) => {
    images.forEach((image) => {
        const card = createImageCard(image);
        gallery.appendChild(card);
    });
};

const loadImages = async () => {
    const images = await fetchImages(currentSearchQuery, currentPage);
    if (images.length === 0) {
        notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    appendImagesToGallery(images);
    currentPage++;
    notiflix.Notify.success(`Hooray! We found ${images.length} images.`);
};

const searchImages = async (event) => {
    event.preventDefault();
    const searchQueryInput = searchForm.querySelector('input[name="searchQuery"]');
    const searchQuery = searchQueryInput.value.trim();
    if (!searchQuery) {
        return;
    }

    if (searchQuery !== currentSearchQuery) {
        clearGallery();
        currentPage = 1;
        currentSearchQuery = searchQuery;
    }

    loadImages();
    searchQueryInput.value = '';
};

searchForm.addEventListener('submit', searchImages);

loadMoreButton.addEventListener('click', loadImages);

// Initialize SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
});

// Smooth scrolling
loadMoreButton.addEventListener('click', () => {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
});