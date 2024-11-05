function loadRecommendedMovies() {
    // Fungsi untuk melakukan BFS dan mengurutkan film berdasarkan rating tertinggi per genre
    function bfsSortMovies(pages) {
        const movieMap = new Map(); // Untuk menyimpan film berdasarkan genre

        // Lakukan BFS traversal
        for (const page of pages) {
            const genre = page.genre; // Ambil genre dari halaman
            if (!movieMap.has(genre)) {
                movieMap.set(genre, []); // Inisialisasi array untuk genre ini
            }
            movieMap.get(genre).push(...page.data); // Tambahkan film ke genre yang sesuai
        }

        const sortedMovies = []; // Array untuk menyimpan film yang sudah diurutkan
        movieMap.forEach((movies) => {
            const uniqueMovies = new Map(); // Map untuk menjaga keunikan film
            
            // Tambahkan film unik per genre
            for (const movie of movies) {
                if (!uniqueMovies.has(movie._id)) {
                    uniqueMovies.set(movie._id, movie);
                }
            }
            
            // Mengurutkan film berdasarkan rating tertinggi
            const sortedByRating = Array.from(uniqueMovies.values()).sort((a, b) => b.rating - a.rating);
            sortedMovies.push(...sortedByRating); // Gabungkan ke dalam hasil akhir
        });

        return sortedMovies; // Kembalikan film yang sudah diurutkan
    }

    const genres = JSON.parse(localStorage.getItem('favGenres'));
    if (!genres || genres.length === 0) {
        document.getElementById('ifRecommendNotExists').innerHTML = `
        <dotlottie-player
  autoplay=""
  loop=""
  src="https://assets-v2.lottiefiles.com/a/f0ec4bf6-117f-11ee-a568-3f00b396dc0b/c7ckQYzSl9.lottie"
  style="width: 320px; margin: auto;"
>
</dotlottie-player>
        <h4 class="text-center">Wadoo.. Belum ada rekomendasi nih, coba eksplor filmnya dulu</h4>
        `;
        return;
    }

    // Fetch data berdasarkan semua genre favorit dalam satu permintaan
    const fetchPromises = genres.map(genre => 
        fetch(`https://pilem.premanto.lol/genres/${genre}`).then(response => response.json())
    );

    Promise.all(fetchPromises)
    .then(pages => {
        const sortedMovies = bfsSortMovies(pages); // Mengurutkan film berdasarkan rating menggunakan BFS

        // Tampilkan daftar film pada elemen recommendedYou
        const popten = document.getElementById('recommendedYou');
        popten.innerHTML = ''; // Kosongkan sebelum menambah konten baru
        console.log(sortedMovies);
        sortedMovies.forEach((movie, index) => {
            const num = index + 1;
            const slideContent = `
                <li class="swiper-slide">
                    <div class="iq-top-ten-block">
                        <div class="block-image position-relative">
                            <div class="img-box" >
                                <a class="overly-images" href="movie-detail.html?m=${movie._id}">
                                    <img src="${movie.posterImg}" alt="movie-card" class="img-fluid object-cover" style="border-radius:20px">
                                </a>
                                <span class="top-ten-numbers texture-text">${num}</span>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            popten.innerHTML += slideContent;
        });

        // Inisialisasi ulang Swiper setelah konten diperbarui
        initializeSwiper();
    })
    .catch(error => {
        console.error('Error fetching movies:', error);
        document.getElementById('recommendedYou').innerHTML = '<p>Tidak dapat memuat rekomendasi</p>';
    });
}






// Panggil fungsi loadRecommendedMovies untuk menjalankan kode
loadRecommendedMovies();


fetch('https://pilem.premanto.lol/popular/movies')
    .then(response => response.json())
    .then(res => {
        console.log(res.data);
        const movies = res.data;
        const miniThumb = document.getElementById('miniThumb');

        movies.forEach(movie => {
            const starRating = movie.rating;
            let starRatingHtml = '';
            for (let i = 0; i < starRating; i++) {
                starRatingHtml += '<li><i class="fa fa-star" aria-hidden="true"></i></li>';
            }
            let genres = '';
            movie.genres.forEach(genre => {
                genres += `<a href="view-all-movie.html" class="fw-normal text-white text-decoration-none ms-2">${genre}</a>`;
            });
            const slideContent = `
                <div class="swiper-slide slide s-bg-1 p-0">
                    <div class="banner-home-swiper-image">
                        <img src="${movie.posterImg}" alt="${movie.title}" style="border-radius:20px">
                    </div>
                    <div class="container-fluid position-relative h-100">
                        <div class="slider-inner h-100">
                            <div class="row align-items-center iq-ltr-direction h-100">
                                <div class="col-lg-7 col-md-12">
                                    <h1 class="texture-text big-font-5 letter-spacing-1 line-count-1 text-uppercase mb-0 RightAnimate">${movie.title}</h1>
                                    <div class="d-flex flex-wrap align-items-center r-mb-23 RightAnimate-two">
                                        <div class="slider-ratting d-flex align-items-center">
                                            <ul class="ratting-start p-0 m-0 list-inline text-warning d-flex align-items-center justify-content-left">
                                                ${starRatingHtml}
                                            </ul>
                                            <span class="text-white ms-2 font-size-14 fw-500">${starRating}/10</span>
                                            <span class="ms-2">
                                                <img src="assets/images/movies/imdb-logo.svg" alt="imdb logo" class="img-fluid">
                                            </span>
                                        </div>
                                        <span class="badge rounded-0 text-white text-uppercase p-2 mx-3 bg-secondary">${movie.qualityResolution}</span>
                                    </div>
                                    <p class="line-count-3 RightAnimate-two"></p>
                                    <div class="trending-list RightAnimate-three">
                                        <div class="text-primary genres fw-500">Genres:
                                            <a href="view-all-movie.html" class="fw-normal text-white text-decoration-none ms-2">${genres}</a>
                                        </div>
                                    </div>
                                    <div class="RightAnimate-four">
                                        <div class="iq-button">
                                            <a href="movie-detail.html?m=${movie._id}" class="btn text-uppercase position-relative">
                                                <span class="button-text">play now</span>
                                                <i class="fa-solid fa-play"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            miniThumb.innerHTML += slideContent;
        });
        const popten = document.getElementById('popten');
        movies.forEach(movie => {
            const num = movies.indexOf(movie) + 1;
            const slideContent = `
                <li class="swiper-slide">
                    <div class="iq-top-ten-block">
                        <div class="block-image position-relative">
                            <div class="img-box">
                                <a class="overly-images" href="movie-detail.html?m=${movie._id}">
                                    <img src="${movie.posterImg}" alt="movie-card" class="img-fluid object-cover" style="border-radius:20px">
                                </a>
                                <span class="top-ten-numbers texture-text">${num}</span>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            popten.innerHTML += slideContent;
        });
        initializeSwiper();
    })
    .catch(error => console.error('Error fetching movies:', error));

fetch('https://pilem.premanto.lol/popular/series')
    .then(response => response.json())
    .then(res => {
        console.log(res.data);
        const series = res.data;
        const seriesThumb = document.getElementById('toptenseries');

        series.forEach(serie => {
            const num = series.indexOf(serie) + 1;
            const slideContent = `
                <li class="swiper-slide">
                    <div class="iq-top-ten-block">
                        <div class="block-image position-relative">
                            <div class="img-box">
                                <a class="overly-images" href="series-detail.html?m=${serie._id}&s=1&e=1">
                                    <img src="${serie.posterImg}" alt="movie-card" class="img-fluid object-cover" style="border-radius:20px">
                                </a>
                                <span class="top-ten-numbers texture-text">${num}</span>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            seriesThumb.innerHTML += slideContent;
        });
        initializeSwiper();
    })

function initializeSwiper() {

    if (document.querySelectorAll('[data-swiper="home-banner-slider"]').length) {
        const options = {
            centeredSlides: false,
            slidesPerView: 1,
            loop: true,
            spaceBetween: 10,
            navigation: {
                nextEl: "#home-banner-slider-next",
                prevEl: "#home-banner-slider-prev",
            },
            responsive: [
                {
                    breakpoint: 992,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                },
            ],
        };
        let homeSwiper = new Swiper('[data-swiper="home-banner-slider"]', options);

        document.addEventListener("theme_scheme_direction", (e) => {
            homeSwiper.destroy(true, true);
            setTimeout(() => {
                homeSwiper = new Swiper('[data-swiper="home-banner-slider"]', options);
            }, 500);
        });
    }
}

