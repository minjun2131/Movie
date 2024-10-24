function showModal(movieArray, thisMovieId) {

    modalInfo.innerHTML = "";  // 여기서 기존 내용을 초기화

    movieArray.forEach((movie) => {
        if (movie.id === thisMovieId) {
            let posterURL = movie.poster_path;
            let title = movie.title;
            let voteAverage = movie.vote_average;
            let overView = movie.overview;
            let releaseDate = movie.release_date;
            let movieId = movie.id;

            const div = document.createElement("div");
            div.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${posterURL}" alt="${title}" />
                <h3>${title}</h3>
                <p>${overView}</p>
                <p>${releaseDate}</p>
                <p>${voteAverage}</p>
            `;
            bookMarkBtn.dataset.id = movieId;
            modalInfo.append(div);
            modal.style.display = 'block'; 
        }
    });

    // 모달 닫기 이벤트는 모달이 열릴 때마다 추가할 필요가 없으므로 한번만 추가
    const modalClose = document.querySelector('.modal');
    modalClose.removeEventListener('click', closeModal);  // 중복 방지
    modalClose.addEventListener('click', closeModal);
}

function closeModal() {
    modalInfo.innerHTML = "";  // 모달 내용 초기화
    modal.style.display = "none";  // 모달 닫기
}