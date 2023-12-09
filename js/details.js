"use strict";

const deleteButton = document.createElement('button');
deleteButton.classList.add('btn');
deleteButton.innerHTML = `»<i class="fa-solid fa-trash-can"></i>`;

document.addEventListener('DOMContentLoaded', async () => {
    const wrapper = document.querySelector('.wrapper');
    const notification = document.querySelector('.notification');
    const notificationContainer = document.querySelector('.notification-container');
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const blog = await response.json();
        displayBlog(wrapper, blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        displayErrorNotification('Error fetching blog.');
    }

    wrapper.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const blogId = event.target.dataset.blogId;
            try {
                await deleteBlog(blogId);
            } catch (error) {
                console.error('Error deleting blog:', error);
                displayErrorNotification('Error deleting blog.');
            }
        }
    });
});

function displayBlog(wrapper, blog) {
    const article = document.createElement('article');
    article.classList.add('article');

    const articleHeader = document.createElement('div');
    articleHeader.classList.add('article-header');

    const avatarImg = document.createElement('img');
    avatarImg.src = blog.profile;
    avatarImg.width = '60';
    avatarImg.height = '60';
    avatarImg.alt = 'profile picture';
    avatarImg.classList.add('avatar');

    const headerDetails = document.createElement('div');
    headerDetails.textContent = `${blog.author} - ${blog.date}`;

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    const editLink = document.createElement('a');
    editLink.classList.add('btn');
    editLink.href = `/edit.html?id=${blog.id}`;
    editLink.innerHTML = `»<i class="fa-solid fa-pen"></i>`;

    const deleteBtn = deleteButton.cloneNode(true);
    deleteBtn.dataset.blogId = blog.id;

    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await deleteBlog(blog.id);
        } catch (error) {
            console.error('Error deleting blog:', error);
            displayErrorNotification('Error deleting blog.');
        }
    });

    btnContainer.appendChild(editLink);
    btnContainer.appendChild(deleteBtn);

    articleHeader.appendChild(avatarImg);
    articleHeader.appendChild(headerDetails);
    articleHeader.appendChild(btnContainer);

    const articleBody = document.createElement('p');
    articleBody.classList.add('article-body');
    articleBody.textContent = blog.content;

    article.appendChild(articleHeader);
    article.appendChild(articleBody);

    wrapper.appendChild(article);
}

async function deleteBlog(blogId) {
    try {
        const response = await fetch(`http://localhost:3000/blogs/${blogId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        // Redirect to the landing page after successful deletion
        window.location.href = 'index.html';
        return response.json(); // Added for debugging
    } catch (error) {
        throw error;
    }
}



function displayErrorNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;

    const notificationContainer = document.querySelector('.notification-container');
    notificationContainer.classList.remove('hidden');
}