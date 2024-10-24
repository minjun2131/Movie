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





// 실행되는 함수 파트
function loadData() {

    fetch(mainURL, options)
    .then(response => response.json())
    .then(data => {
        const dataArray = data.results; // 새로운 data배열
        bookMarkRender(dataArray);
        renderData(dataArray);
        renderModal(dataArray);     
    })
    .catch(err => console.error(err));

}

function addDelLocalStorage() {
    let clickButton = document.querySelector('.bookMarkAdd');
    let getDataValue = clickButton.getAttribute('data-id');
    console.log(getDataValue);
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
        console.log(clickButton);
        clickButton.textContent = '북마크 추가'
        alert('북마크를 해제하셨습니다.');
    } else {
    bookMarkitems.push(getDataValue);
    localStorage.setItem('dataId-list', JSON.stringify(bookMarkitems));
    
    clickButton.textContent = '북마크 해제'
    alert('북마크에 추가하셨습니다.');
    
    }
    
}
// 북마크 보여주기 버튼 누르면 북마크한 영화만 보여주기
function bookMarkRender(){
    const bookMarkShow = document.querySelectorAll('.bookMark');
    for (button of bookMarkShow){
        button.addEventListener("click",()=>{
            movieList.innerHTML = '';
            let bookMarkKeys = JSON.parse(localStorage.getItem('dataId-list'));
            console.log(bookMarkKeys.length);
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
                            <p>${voteAverage}</p>`;
                    movieCard.addEventListener('click',function(){
                        bookMarkModal(bookId);
                    });
                    for (let id = 0; id < bookMarkKeys.length; id++) {
                        if (bookId.id === Number(bookMarkKeys[id])) {
                            movieList.appendChild(movieCard);
                        } 
                    }
                    console.log(bookId);
                })
                .catch(err => console.error(err));
            } 
        });
        
    }
}

// 북마크 클릭했을 때 보여주는 Modal 정보

function bookMarkModal(movie){
    const movieInfoAll = document.querySelector(".movieCard");
    const modal = document.querySelector('.modalWrap');
    const modalInfo = document.querySelector('.movieInfoCard');  
    let thisMovieId = movieInfoAll.getAttribute('data-id');
    thisMovieId = Number(thisMovieId);
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
        
    `;

    modalInfo.append(div);

    // button
    let bookMarkBtn = document.createElement("button");
    bookMarkBtn.className = 'bookMarkAdd';
    bookMarkBtn.dataset.id = posterId;
    modalInfo.appendChild(bookMarkBtn);
    bookMarkBtn.textContent = '북마크 추가';
    bookMarkBtn.addEventListener("click",function(){
        addDelLocalStorage();

    });
   
   

    
    modal.style.display = 'block';
    const modalClose = document.querySelector('.modal');

    modalClose.addEventListener('click', function () {
       modalInfo.innerHTML = "";
       modal.style.display = "none";
    },{once : true});
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
function renderModal(movie) {
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
                        `;
                        if (thisMovieId === posterId) {
                            modalInfo.append(div);
                            modal.style.display = 'block';
                            // button
                            let bookMarkBtn = document.createElement("button");
                            bookMarkBtn.className = 'bookMarkAdd';
                            bookMarkBtn.dataset.id = posterId;
                            modalInfo.appendChild(bookMarkBtn);
                            bookMarkBtn.textContent = '북마크 추가';
                            bookMarkBtn.addEventListener("click",function(){
                                addDelLocalStorage();

                            });

                           
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
    console.log("searchUrl: ", searchUrl);
    fetch(searchUrl, options)
    .then(response => response.json())
    .then(searchApi => {
        const searchArray = searchApi.results;
        // 검색하면 loadData 지우고 검색결과만 남기기
        // 디바운싱 작업 필요
        if (searchInput.value !== '') {
            movieList.innerHTML = '';       
        }
        renderData(searchArray);
        renderModal(searchArray);

        // 로컬 스토리지 관련 전역 함수 및 이벤트
    
    }).catch(err => console.error(err));
};






loadData();
// addBookMarks();
// showBookMarks();
