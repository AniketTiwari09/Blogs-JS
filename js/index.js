"use strict";
const MAX_LENGTH = 50;
const PAGE_LIMIT = 12;

function displayErrorNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;

    const notificationContainer = document.querySelector('.notification-container');
    notificationContainer.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSortedAndPaginatedBlogs(1); 
});

function fetchSortedAndPaginatedBlogs(pageNumber) {
    const apiUrl = `http://localhost:3000/blogs?_page=${pageNumber}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const totalCount = response.headers.get('x-total-count');
            return response.json().then(blogs => {
                displayBlogs(blogs);
                createPaginationButtons(Math.ceil(totalCount / PAGE_LIMIT), pageNumber); 
                setActiveButton(pageNumber); 
            });
        })
        .catch(error => {
            console.error('Error fetching blogs:', error);
            displayErrorNotification('Error fetching blogs. Please try again later.'); 
        });
        
}

function displayBlogs(blogs) {
    const articlesWrapper = document.querySelector('.articles-wrapper');
    articlesWrapper.innerHTML = '';

    blogs.forEach(blog => {
        const article = document.createElement('article');
        article.classList.add('card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        article.addEventListener('click', () => {
            window.location.href = `details.html?id=${blog.id}`; 
        });

        const avatarImg = document.createElement('img');
        avatarImg.src = blog.profile;
        avatarImg.width = '60';
        avatarImg.height = '60';
        avatarImg.alt = 'profile picture';
        avatarImg.classList.add('avatar');

        const headerDetails = document.createElement('div');
        headerDetails.textContent = `${blog.author} ${new Date(blog.date).toDateString()}`; 

        cardHeader.appendChild(avatarImg);
        cardHeader.appendChild(headerDetails);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const blogTitle = document.createElement('h3');
        blogTitle.textContent = blog.title; 

        const blogContent = document.createElement('p');
        blogContent.textContent = blog.content.length > MAX_LENGTH ? blog.content.substring(0, MAX_LENGTH) + '...' : blog.content;

        cardBody.appendChild(blogTitle);
        cardBody.appendChild(blogContent);

        article.appendChild(cardHeader);
        article.appendChild(cardBody);

        articlesWrapper.appendChild(article);
    });
    
}


function createPaginationButtons(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            fetchSortedAndPaginatedBlogs(i); 
        });
        paginationContainer.appendChild(button);
    }
}

function setActiveButton(pageNumber) {
    const buttons = document.querySelectorAll('.page-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === pageNumber) {
            button.classList.add('active');
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim();
        if (searchValue !== '') {
            fetchFilteredBlogs(1, searchValue);
        } else {
            fetchSortedAndPaginatedBlogs(1);
        }
    });

    fetchSortedAndPaginatedBlogs(1);
});

function fetchFilteredBlogs(pageNumber, searchString) {
    const apiUrl = `http://localhost:3000/blogs?q=${searchString}&_page=${pageNumber}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const totalCount = response.headers.get('x-total-count');
            return response.json().then(blogs => {
                displayBlogs(blogs);
                createPaginationButtons(Math.ceil(totalCount / PAGE_LIMIT), pageNumber);
                setActiveButton(pageNumber);
            });
        })
        .catch(error => {
            console.error('Error fetching filtered blogs:', error);
        });
}