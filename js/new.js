"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const notification = document.querySelector('.notification');
    const notificationContainer = document.querySelector('.notification-container');

    form.addEventListener('submit', event => {
        event.preventDefault(); 

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const content = document.getElementById('content').value.trim();

        if (validateInputs(title, author, content)) {
            createNewBlog(title, author, content);
        } else {
            displayValidationError('Please provide valid input for Title, Author, and Content');
        }
    });
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        notificationContainer.classList.add('hidden');
    });
});


function validateInputs(title, author, content) {
    return title.length >= 3 && author.length >= 3 && content.length >= 10;
}

function createNewBlog(title, author, content) {
    const currentDate = new Date().toISOString();
    const profileImage = 'images/default.jpeg';

    const newBlog = {
        title,
        author,
        content,
        date: currentDate,
        profile: profileImage
    };

    fetch('http://localhost:3000/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBlog)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        window.location.href = 'index.html'; 
    })
    .catch(error => {
        console.error('Error creating new blog:', error);
    });
}

function displayValidationError(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;

    const notificationContainer = document.querySelector('.notification-container');
    notificationContainer.classList.remove('hidden');
}

function displayErrorNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;

    const notificationContainer = document.querySelector('.notification-container');
    notificationContainer.classList.remove('hidden');
}
