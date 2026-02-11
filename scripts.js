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

    // Populate auto navigation menu
    const navList = document.getElementById('nav-list');
    const navSections = [
        { name: 'Album Info', id: 'album-section' },
        { name: 'Tracklist', id: 'tracklist-section' },
        { name: 'Reviews', id: 'reviews-section' },
        { name: 'Listen', id: 'streaming-section' }
    ];

    navSections.forEach(section => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${section.id}`;
        a.textContent = section.name;
        a.style.cursor = 'pointer';
        a.onclick = (e) => {
            e.preventDefault();
            const element = document.getElementById(section.id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('nav-bar').classList.remove('open');
            }
        };
        li.appendChild(a);
        navList.appendChild(li);
    });

    // Add section IDs to main content areas
    const mainContentSlices = document.querySelectorAll('.main-content-slice');
    if (mainContentSlices.length >= 3) {
        mainContentSlices[0].id = 'album-section';
        mainContentSlices[1].id = 'reviews-section';
        mainContentSlices[2].id = 'streaming-section';
    }

    // Add smooth scroll behavior styling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Setup mini header with quick nav
    const miniHeader = document.getElementById('mini-header');
    const miniNavLinks = document.getElementById('mini-nav-links');
    
    navSections.forEach(section => {
        const a = document.createElement('a');
        a.href = `#${section.id}`;
        a.textContent = section.name;
        a.onclick = (e) => {
            e.preventDefault();
            const element = document.getElementById(section.id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };
        miniNavLinks.appendChild(a);
    });

    // Show mini header on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPos = window.scrollY;
                if (scrollPos > 200) {
                    miniHeader.classList.add('visible');
                } else {
                    miniHeader.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    if (json && archiveJson) {
        document.getElementById('album-title').textContent = `${json.album} by ${json.artist}`;
        document.getElementById('mini-album-title').textContent = `${json.album} by ${json.artist}`;
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