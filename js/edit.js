"use strict";

function fetchBlogDetails(blogId) {
    return fetch(`http://localhost:3000/blogs/${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching blog details:', error);
            displayErrorNotification('Error fetching blog details. Please try again later.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    fetchBlogDetails(blogId)
        .then(blog => {
            populateForm(blog);
            form.addEventListener('submit', event => {
                event.preventDefault();

                const title = document.getElementById('title').value.trim();
                const content = document.getElementById('content').value.trim();

                if (validateInputs(title, content)) {
                    const updatedBlog = {
                        ...blog,
                        title,
                        content
                    };
                    updateBlog(blogId, updatedBlog);
                } else {
                    displayValidationError('Please provide valid input for Title and Content');
                }
            });
        })
        .catch(error => {
            console.error('Error fetching blog details:', error);
            displayErrorNotification('Error fetching blog details. Please try again later.');
        });
});

function populateForm(blog) {
    document.getElementById('title').value = blog.title;
    document.getElementById('content').value = blog.content;
}

function validateInputs(title, content) {
    return title.length >= 3 && content.length >= 10;
}

function updateBlog(blogId, updatedBlog) {
    fetch(`http://localhost:3000/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBlog)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        window.location.href = `details.html?id=${blogId}`;
    })
    .catch(error => {
        console.error('Error updating blog:', error);
    });
}

function displayValidationError(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;

    const notificationContainer = document.querySelector('.notification-container');
    notificationContainer.classList.remove('hidden');
}
