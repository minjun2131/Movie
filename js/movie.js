const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmVhZmU5NmMyZjE0YmU5NWU0MjllMDI1NGUwNzA2ZSIsIm5iZiI6MTcyODk2MDI2OC40NzAzMzYsInN1YiI6IjY3MGRkMzQ0NDJlMTM5MWM1NjY2ZTRmZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CoC9JjHC265cCfvPvWzkSpHoRElhF-3zrSP3gGxyN3I'
    }
};

// 전역 변수
const mainURL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko&page=1&region=KR&sort_by=popularity.desc';
const movieList = document.querySelector('main');
const modal = document.querySelector('.modalWrap');
const modalInfo = document.querySelector('.movieInfoCard');
const bookMarkBtn = document.querySelector('.bookMarkAddDel');

// 초기 로드
loadData();


// 영화 데이터 로드 함수
async function loadData() {
    try {
        const response = await fetch(mainURL, options);
        const data = await response.json();
        const dataArray = data.results;
        renderData(dataArray);
        bookMarkRender();
    } catch (error) {
        console.error(error);
    }
}

// 화면에 영화 정보 렌더링 함수
function renderData(movieArray) {
    movieList.innerHTML = ''; 
    
    movieArray.forEach((movie) => {
        let posterURL = movie.poster_path;
        let title = movie.title;
        let voteAverage = movie.vote_average;
        let posterId = movie.id;

        let movie_html = `
            <div class='movieCard' data-id="${posterId}">
                <p class='moviePoster'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/></p>
                <h3>${title}</h3>
                <p>평점 : ${voteAverage}</p>
            </div>
        `;
        movieList.innerHTML += movie_html;
    });
    
    // 카드 클릭 시 모달 열기
    movieList.addEventListener("click", (e) => {
        const clickedCard = e.target.closest(".movieCard");
        if (clickedCard) {
            let thisMovieId = Number(clickedCard.getAttribute('data-id'));
            showModal(movieArray, thisMovieId);
        }
    });
}

// 모달 보여주는 함수
function showModal(movieArray, thisMovieId) {
    
    movieArray.forEach((movie) => {
        if (movie.id === thisMovieId) {
            let posterURL = movie.poster_path;
            let title = movie.title;
            let voteAverage = movie.vote_average;
            let overView = movie.overview;
            let releaseDate = movie.release_date;
            let movieId = movie.id;
            let div = `
                <p class='img'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}" /></p>
                <h3>${title}</h3>
                <p class='text'>${overView}</p>
                <p>개봉일 : ${releaseDate}</p>
                <p>평점 : ${voteAverage}</p>
            `;
            bookMarkBtn.dataset.id = movieId;
            modalInfo.innerHTML = div;
            modal.style.display = 'block';
        }
    });

    // 모달 1번 초기화
    modal.addEventListener('click', function () {
        modalInfo.innerHTML = ""; 
        modal.style.display = "none"; 
    });
}

// 실시간 search 업데이트
const searchInput = document.getElementById('search');
searchInput.addEventListener("input", updateValue);
let debounceTimer = null;

async function updateValue(e) {
    // 타이머 중복 방지
    clearTimeout(debounceTimer); 
    modalInfo.innerHTML = ""; 
    // 새로운 타이머 200 초
    debounceTimer = setTimeout(async () => { 
        searchInput.value = e.target.value;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&include_adult=false&language=ko-KR&page=1`
        try {
            const response = await fetch(searchUrl, options);
            const searchApi = await response.json();
            const searchArray = searchApi.results;

            // 값이 있으면 리셋 값이 없을 때 초기화면
            if (searchInput.value !== '') {
                movieList.innerHTML = '';       
            } else {
                loadData();
            }
            renderData(searchArray);

        } catch (err) {
            console.error(err);
        }
    }, 200);
}
bookMarkBtn.addEventListener('click',function (event) {
    let getDataValue = this.getAttribute('data-id');
    // 밖에서 함수가 선언된 순간에 값이 바뀌지 않는다.
    const bookMarkitems = localStorage.getItem('dataId-list') ? JSON.parse(localStorage.getItem('dataId-list')) : [];
    if (bookMarkitems.includes(getDataValue)) {      
        let items = bookMarkitems.filter((id)=>{
            if (Number(id) === Number(getDataValue)) {
                return false;
            } else {
                return true;
            }
        })
        localStorage.setItem('dataId-list', JSON.stringify(items));
        event.stopPropagation();
        event.target.textContent = '북마크 추가'
        alert('북마크를 해제하셨습니다.');
        
    } 
    else {
    bookMarkitems.push(getDataValue);
    localStorage.setItem('dataId-list', JSON.stringify(bookMarkitems));
    
    event.target.textContent = '북마크 해제'
    event.stopPropagation();
    alert('북마크에 추가하셨습니다.');
    
    }
});
// 북마크 보여주기 버튼 누르면 북마크한 영화만 보여주기
function bookMarkRender(){
    const bookMarkShow = document.querySelector('.bookMark');
    let bookMarkKeys = JSON.parse(localStorage.getItem('dataId-list'));
    bookMarkShow.addEventListener("click",(e)=>{
        movieList.innerHTML = '';
        console.log(bookMarkKeys);
        let bookUrl = ''
        
        for (let i = 0; i < bookMarkKeys.length ; i++) {
            bookUrl = `https://api.themoviedb.org/3/movie/${bookMarkKeys[i]}?language=ko-KR`;
            fetch(bookUrl, options)
            .then(res => res.json())
            .then(bookId=> {
                let posterURL = bookId.poster_path;
                let title = bookId.title;
                let voteAverage = bookId.vote_average;
                let posterId = bookId.id;
                let movieCard = document.createElement("div");
                movieCard.className = 'movieCard';
                movieCard.dataset.id = posterId;
                movieCard.innerHTML =  `
                        <div class='moviePoster'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/></div>
                        <h3>${title}</h3>
                        <p>평점 : ${voteAverage}</p>`;
                for (let id = 0; id < bookMarkKeys.length; id++) {
                    if (bookId.id === Number(bookMarkKeys[id])) {
                        movieList.appendChild(movieCard);
                        movieCard.addEventListener('click',function(){
                            bookMarkModal(bookId);
                        });
                    } 
                }
            })
            .catch(err => console.error(err));
        } 
    });
        
}

function bookMarkModal(movie){
    console.log(modalInfo);
    modalInfo.innerHTML  = ' '
    let thisMovieId = modalInfo.getAttribute('data-id');
    thisMovieId = Number(thisMovieId);
    let posterURL = movie.poster_path;
    let title = movie.title;
    let voteAverage = movie.vote_average;
    let overView = movie.overview;
    let releaseDate = movie.release_date;
    let posterId = movie.id;
    modalInfo.innerHTML = `
        <p class='img'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/></p>
        <h3>${title}</h3>
        <p class='text'>${overView}</p>
        <p>개봉일 : ${releaseDate}</p>
        <p>평점 : ${voteAverage}</p>
        
    `;
    
    modal.style.display = 'block';
    bookMarkBtn.dataset.id = posterId;
   
}
