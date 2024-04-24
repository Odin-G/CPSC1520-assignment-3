let albums = []
let favorites = []

async function appInit() {
    albums = await getRequest('https://661c292fe7b95ad7fa69d7d1.mockapi.io/api/v1/albums')
    favorites = await getRequest('https://661c292fe7b95ad7fa69d7d1.mockapi.io/api/v1/favorites')
}

async function getRequest(url) {
    const res = await fetch(url)
    return await res.json()
}

appInit()

// Task 1

const searchButton = document.getElementById('search-button')
const favoritesButton = document.getElementById('favorites-button')
const searchTab = document.getElementById('search-tab')
const favoritesTab = document.getElementById('favorites-tab')

favoritesButton.addEventListener('click', () => {
    searchButton.classList.remove('active')
    favoritesButton.classList.add('active')
    searchTab.classList.add('d-none')
    favoritesTab.classList.remove('d-none')
})

searchButton.addEventListener('click', () => {
    searchButton.classList.add('active')
    favoritesButton.classList.remove('active')
    searchTab.classList.remove('d-none')
    favoritesTab.classList.add('d-none')
})

// Task 2

const searchForm = document.getElementById('search-form')
const searchResults = document.getElementById('search-results')

searchForm.addEventListener('submit', async e => {
    e.preventDefault()
    
    const query = document.getElementById('query').value.trim().toLowerCase()
    
    if (query) {
        searchResults.innerHTML = ''

        albums.filter(album => album.albumName.toLowerCase().includes(query) || album.artistName.toLowerCase().includes(query))
        .forEach(album => {
            const listItem = document.createElement('li')
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')
            searchResults.appendChild(listItem)
            
            const contentDiv = document.createElement('div')
            contentDiv.classList.add('ms-2', 'me-auto')
            listItem.appendChild(contentDiv)
            
            const titleDiv = document.createElement('div')
            titleDiv.classList.add('fw-bold')
            titleDiv.textContent = album.albumName
            contentDiv.appendChild(titleDiv)
            
            const ratingSpan = document.createElement('span')
            ratingSpan.classList.add('badge', 'bg-primary', 'rounded-pill')
            ratingSpan.textContent = album.averageRating
            titleDiv.appendChild(ratingSpan)
    
            const artistSpan = document.createElement('span')
            artistSpan.textContent = album.artistName
            contentDiv.appendChild(artistSpan)
            
            const addButton = document.createElement('button')
            addButton.classList.add('btn', 'btn-success')
            addButton.textContent = 'Add to Favorites'
            addButton.addEventListener('click', () => addToFavorites(album))
            listItem.appendChild(addButton)
        })
    }
})

//Task 3

function addToFavorites(album) {
    const albumIndex = favorites.findIndex(a => a.id === album.id)

    if (albumIndex === -1) {
        favorites.push(album)
        postToFavorites(album)
    }
}

//Task 4

function displayFavoriteAlbums() {
    const favoritesList = document.getElementById('favorites')
    favoritesList.innerHTML = ''
    
    favorites.forEach(album => {
        const listItem = document.createElement('li')
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')
        favoritesList.appendChild(listItem)
        
        const contentDiv = document.createElement('div')
        contentDiv.classList.add('ms-2', 'me-auto')
        listItem.appendChild(contentDiv)
        
        const titleDiv = document.createElement('div')
        titleDiv.classList.add('fw-bold')
        titleDiv.textContent = album.albumName
        contentDiv.appendChild(titleDiv)
        
        const ratingSpan = document.createElement('span')
        ratingSpan.classList.add('badge', 'bg-primary', 'rounded-pill')
        ratingSpan.textContent = album.averageRating
        titleDiv.appendChild(ratingSpan)

        const artistSpan = document.createElement('span')
        artistSpan.textContent = album.artistName
        contentDiv.appendChild(artistSpan)
        
        const removeButton = document.createElement('button')
        removeButton.classList.add('btn', 'btn-success')
        removeButton.textContent = 'Remove from Favorites'
        removeButton.addEventListener('click', async () => {
            await removeFromFavorites(album)
            
            displayFavoriteAlbums()
        })
        listItem.appendChild(removeButton)
    })
}

document.getElementById('favorites-button').addEventListener('click', () => {
    displayFavoriteAlbums()
})

//Task 5

async function postToFavorites(data) {
    const requestHeader = new Headers()
    requestHeader.append('content-type', 'application/json')
    requestHeader.append('cache', 'no-store')

    const payload = JSON.stringify(data)

    const requestObject = {
        method: 'POST',
        headers: requestHeader,
        body: payload,
        redirect: 'follow'
    }

    const res = await fetch('https://661c292fe7b95ad7fa69d7d1.mockapi.io/api/v1/favorites', requestObject)
    return await res.json()
}

//Bonus Task
async function removeFromFavorites(album) {
    const albumIndex = favorites.findIndex(a => a.id === album.id)

    if (albumIndex !== -1) {
        favorites.splice(albumIndex, 1)
        const res = await fetch(`https://661c292fe7b95ad7fa69d7d1.mockapi.io/api/v1/favorites/${album.id}`, {
            method: 'DELETE'
        })

        return await res.json()
    }
}