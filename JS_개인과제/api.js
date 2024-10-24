// API key 값
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmVhZmU5NmMyZjE0YmU5NWU0MjllMDI1NGUwNzA2ZSIsIm5iZiI6MTcyODk2MDI2OC40NzAzMzYsInN1YiI6IjY3MGRkMzQ0NDJlMTM5MWM1NjY2ZTRmZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CoC9JjHC265cCfvPvWzkSpHoRElhF-3zrSP3gGxyN3I'
    }
}
const mainURL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko&page=1&region=KR&sort_by=popularity.desc';

// 실시간 search 업데이트
const searchInput = document.getElementById('search');
searchInput.addEventListener("input", updateValue);

// 로컬스토리지 북마크 추가 함수
// const storage = localStorage.setItem('data-id', JSON.stringify([]));

function addLocalStorage() {
    let clickButton = document.querySelectorAll(".bookMarkAdd");
    for (button of clickButton) {
        button.addEventListener("click",()=>{
            let getDataValue = button.getAttribute('data-id');
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
                
            } else {
            bookMarkitems.push(getDataValue);
            localStorage.setItem('dataId-list', JSON.stringify(bookMarkitems));
            }
        });
    }
}


// 실행되는 함수 파트
function loadData() {

    fetch(mainURL, options)
    .then(response => response.json())
    .then(data => {
        const dataArray = data.results; // 새로운 data배열
        bookMarkRender(dataArray)
        renderData(dataArray);
        renderModal(dataArray);     
    })
    .catch(err => console.error(err));

}




// 북마크 보여주기 버튼 누르면 북마크한 영화만 보여주기
function bookMarkRender(array){
    const bookMarkShow = document.querySelectorAll('.bookMark');
    for (button of bookMarkShow){
        button.addEventListener("click",()=>{
            movieList.innerHTML = '';
            let bookMarkKeys = JSON.parse(localStorage.getItem('dataId-list'));
            array.forEach((movie) => {
                console.log(movie.id);
                let posterURL = movie.poster_path;
                let title = movie.title;
                let voteAverage = movie.vote_average;
                let posterId = movie.id;
                let movie_html = `
                    <div class='movieCard' data-id="${posterId}">
                        <div class='moviePoster'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/></div>
                        <h3>${title}</h3>
                        <p>${voteAverage}</p>
                    </div>
                `
                for (let id = 0; id < bookMarkKeys.length; id++) {
                    if (movie.id === Number(bookMarkKeys[id])) {
                        movieList.innerHTML += movie_html; 
                    } 
                }      
            });
            // 북마크 버전 모달
            renderModal(array); 
        });
        
    }
}

// 화면에 영화정보 보여주는 renderData 
const movieList = document.querySelector('main');
function renderData(array) {
            
            array.forEach((movie) => {

                let posterURL = movie.poster_path;
                let title = movie.title;
                let voteAverage = movie.vote_average;
                let posterId = movie.id;
                let movie_html = `
                    <div class='movieCard' data-id="${posterId}">
                        <div class='moviePoster'><img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/></div>
                        <h3>${title}</h3>
                        <p>${voteAverage}</p>
                    </div>
                `
                movieList.innerHTML += movie_html;          
            });
}

// 화면에 영화정보 클릭하면 renderModal
function renderModal(array) {
            const movieInfoAll = document.querySelectorAll(".movieCard");
            const modal = document.querySelector('.modalWrap');
            const modalInfo = document.querySelector('.movieInfoCard');
            
            for (const button of movieInfoAll) {
               button.addEventListener("click", function () {
                    let thisMovieId = this.getAttribute('data-id');
                    thisMovieId = Number(thisMovieId);
                    array.forEach((movie) => {
                        let posterURL = movie.poster_path;
                        let title = movie.title;
                        let voteAverage = movie.vote_average;
                        let overView = movie.overview;
                        let releaseDate = movie.release_date;
                        let posterId = movie.id;
                        const div = document.createElement("div");
                        div.innerHTML = `
                            <img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}"/>
                            <h3>${title}</h3>
                            <p>${overView}</p>
                            <p>${releaseDate}</p>
                            <p>${voteAverage}</p>
                            <button class='bookMarkAdd' data-id="${posterId}" data-title="${title}">북마크 추가</button>
                            <button class='bookMarkDel'>북마크 삭제</button>
                        `;
                        if (thisMovieId === posterId) {
                            modalInfo.append(div);
                            modal.style.display = 'block';
                            
                            addLocalStorage();
                            // delLocalStorage();
                        }
                    });
                    
                });
            }
            const modalClose = document.querySelector('.modal');
            modalClose.addEventListener('click', function () {
               modalInfo.innerHTML = "";
               modal.style.display = "none";
            });
   
}


// 검색하면 업데이트 되는 함수 파트
function updateValue(e){
    searchInput.value = e.target.value;
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&include_adult=false&language=ko-KR&page=1`;
    fetch(searchUrl, options)
    .then(response => response.json())
    .then(searchApi => {
        const searchArray = searchApi.results;
        // 검색하면 loadData 지우고 검색결과만 남기기
        // 디바운싱 작업 필요
        if (searchInput.value !== '') {
            movieList.innerHTML = '';       
        }
        bookMarkRender(searchArray);
        renderData(searchArray);
        renderModal(searchArray);

        // 로컬 스토리지 관련 전역 함수 및 이벤트
    
    }).catch(err => console.error(err));
};






loadData();
// addBookMarks();
// showBookMarks();
