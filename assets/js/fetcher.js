fetch('https://db-movie.fliw.dev/popular/movies')
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
                        <img src="${movie.posterImg}" alt="${movie.title}">
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
        initializeSwiper();
    })
    .catch(error => console.error('Error fetching movies:', error));

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

