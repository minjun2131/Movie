
let cashData = [];
let cashTime = "";


function loadData() {
    if (cashData.length > 0 && cashTime - new Date() < 36000) {
        renderData(cashData);
        renderModal(cashData);
        bookMarkRender(cashData);
    } else {
        fetch(mainURL, options)
        .then(response => response.json())
        .then(data => {
            const dataArray = data.results; // 새로운 data배열
            cashData = [...dataArray];
            cashTime = new Date();
            renderData(dataArray);
            renderModal(dataArray);
            bookMarkRender(dataArray);
        })
        .catch(err => console.error(err));
    }
    console.log(cashData);
}

// cashe를 쓰는 이유는
// 이제 데이터를 가져와야 하는데 그 데이터를 어딘가 두고 사용하고 싶다
// 그러나 데이터를 어딘가 두고 사용하기에는 굉장히 크다..
// 따라서 cashe 라는 데이터를 하나 생성해놓고
// cash를 사용해는데 이 때
// && cashTime 이라는 시간까지 추가를 해서
// 예를 들어 기존의 api 데이터가 업데이트를 했다면?
// 하는 시간을 비교해서 시간이 다르다면 else에서 데이터를 cash에 업데이트 해주고
// 아니라면 기존에 cash에 들어있는 데이터를 사용해준다.
// 여기서 cash라는 개념은 위의 모양과는 다르지만 인터넷에서 말하는 캐시와 같다
// 즉 용량과 데이터를 더 줄인 상태로 데이터를 가져다 놓고 사용할 수 있다는 말이다.