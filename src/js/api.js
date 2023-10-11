import axios from 'axios';

const apiKey = '39928723-f6b1546c2ba029a098dc6a39a'; 
const perPage = 40;

const fetchImages = async (searchQuery, currentPage) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
};

export { fetchImages };