// Load current album
fetch('./Data/Album.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('album').textContent = data.album;
        document.getElementById('artist').textContent = data.artist;
        document.getElementById('description').textContent = data.description;
        document.getElementById('cover').src = data.cover;
        document.getElementById('spotify').href = data.spotify_link;
    })
    .catch(err => console.error('Failed to load Album.json:', err));

// Load archive
fetch('./Data/Archive.json')
    .then(res => res.json())
    .then(items => {
        const list = document.getElementById('archive-list');
        const entries = Array.isArray(items) ? items : Object.values(items);
        entries.forEach(item => {
            const li = document.createElement('li');
            const year = item.release_date ? new Date(item.release_date).getFullYear() : '';
            li.textContent = `${item.album} — ${item.artist} (${year})`;
            list.appendChild(li);
        });
    })
    .catch(err => console.error('Failed to load Archive.json:', err));

// Toggle archive panel
document.getElementById('archive-toggle').onclick = () => {
    document.getElementById('archive').classList.toggle('open');
};
