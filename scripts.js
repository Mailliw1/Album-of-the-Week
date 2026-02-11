// Load current album
let json;
let archiveJson;

async function fetchAlbum() {
    const response = await fetch('./Data/Album.json');
    json = await response.json();
}

async function fetchArchive() {
    const response = await fetch('./Data/Archive.json');
    archiveJson = await response.json();
}

addEventListener('DOMContentLoaded', async () => {
    await fetchAlbum();
    await fetchArchive();

    console.log(json);
    console.log(json.album);
    console.log(archiveJson);

    if (json && archiveJson) {
        document.getElementById('album-title').textContent = `${json.album} by ${json.artist}`;
        document.getElementById('cover').src = json.cover;
        document.getElementById('album-name').textContent = json.album;
        document.getElementById('artist-name').textContent = json.artist;
        document.getElementById('music-label').textContent = json.label;
        document.getElementById('album-description').textContent = json.description;
        document.getElementById('release-date').textContent = `Released: ${json.release_date}`;
        document.getElementById('genre').textContent = `Genres: ${json.genre}`;
        document.getElementById('spotify').href = json.spotify_link;
        document.getElementById('apple-music').href = json.apple_music_link;
        document.getElementById('youtube-music').href = json.youtube_link;
        document.getElementById('extra-review-content').textContent = json.other_reviews[0].review.replace(/\\n/g, '\n');
        document.getElementById('extra-review-origin').textContent = `Review Courtesy of ${json.other_reviews[0].source} by ${json.other_reviews[0].author}.     Rating: ${json.other_reviews[0].rating}/100`;
        
        const tracklist = document.getElementById('tracklist');
        json.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            const trackNumber = document.createElement('span');
            trackNumber.classList.add('track-number');
            trackNumber.textContent = `${track.track_number}. `;
            
            const trackTitle = document.createElement('span');
            trackTitle.classList.add('track-title');
            trackTitle.textContent = track.title;
            
            const trackDuration = document.createElement('span');
            trackDuration.classList.add('track-duration');
            trackDuration.textContent = ` (${track.duration})`;
            
            li.appendChild(trackNumber);
            li.appendChild(trackTitle);
            li.appendChild(trackDuration);
            tracklist.appendChild(li);
        });
        document.getElementById('total-duration').textContent = `Total Duration: ${json.duration}`;

        document.getElementById('main-review').textContent = json.main_review.replace(/\\n/g, '\n');
        const originLink = document.createElement('a');
        originLink.href = json['review-origin'][1];
        originLink.textContent = `Review Courtesy of ${json['review-origin'][0]}`;
        document.getElementById('origin').appendChild(originLink);

        const extraReviewsLabel = document.getElementsByClassName('button-label');
        json.other_reviews.forEach((review, index) => {
            extraReviewsLabel[index].textContent = `${review.title}`;
        });

        const list = document.getElementById('archive-list');
        let entries = [];
        if (Array.isArray(archiveJson)) {
            entries = archiveJson;
        } else if (archiveJson && Array.isArray(archiveJson.albums)) {
            entries = archiveJson.albums;
        } else if (archiveJson && typeof archiveJson === 'object') {
            // flatten objects like { "2026-02-10": { ... }, ... }
            entries = Object.values(archiveJson).flatMap(v => Array.isArray(v) ? v : [v]);
        }

        entries.forEach(({ album, title: itemTitle, artist, date }) => {
            const li = document.createElement('li');
            const title = album || itemTitle || 'Unknown album';
            const finalArtist = artist || 'Unknown artist';
            li.textContent = date ? `◦ ${title} - ${finalArtist} ◦ (${date})` : `◦ ${title} - ${finalArtist} ◦`;
            list.appendChild(li);
        });
    } else {
        console.log('Failed to load album or archive data.');
    }
});

// Toggle archive panel
document.getElementById('archive-toggle').onclick = () => {
    document.getElementById('archive').classList.toggle('open');
};

document.getElementById('nav-bar-toggle').onclick = () => {
    document.getElementById('nav-bar').classList.toggle('open');
};

document.querySelectorAll('.extra-reviews-buttons').forEach(button => {
    button.onclick = () => {
        const reviewId = button.innerText;
        console.log(reviewId);
        let extraReviewBox = document.getElementById('extra-review-content');
        const reviewContent = json.other_reviews.find(review => review.title === reviewId);
        if (reviewContent) {
            extraReviewBox.textContent = reviewContent.review.replace(/\\n/g, '\n');
            document.getElementById('extra-review-origin').textContent = `Review Courtesy of ${reviewContent.source} by ${reviewContent.author}.     Rating: ${reviewContent.rating}/100`;
        }
    };
});