const API_KEY = "live_GQbPwFOIhAnXcfZXEULbqMKCqySATmd1fKoFdNxxYoDY5gX2zpQakmYd4nl23mxl";

const main = document.querySelector(".photo-container");
const allCatsBtn = document.querySelector(".all-cats");
const favoriteCatsBtn = document.querySelector(".favorite-cats");
const preloader = document.querySelector('.preloader');
const loading = document.querySelector('.loading');

const favoritesCatsList = JSON.parse(localStorage.getItem("myCat")) || [];
let listCats = [];
let activePageAllCats = true;  // что бы не загружал котиков не на той вкладке

// Получаем данные от сервера
function getData() {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=20&api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
        if(activePageAllCats) {
            listCats = [...data];
            showCats(listCats);
        }
    })
}

getData();

// Передаем полученные данные в фукцию для отрисовки
function showCats(data) {
    data.map(createElementShowPhoto);
}

// Создание всех фото по полученным данным
function createElementShowPhoto({ url, id, icon = "fa-regular" }) {
    const photoItem = document.createElement("div");
    photoItem.classList.add("photo-item");
    photoItem.innerHTML = `
        <img src="${url}" alt="${id}"></img>
        <i class="${icon} fa-heart icon"></i>
    `;
    photoItem.addEventListener("click", (e) => likeCat(e));

    main.appendChild(photoItem);
}

// Лайк понравившейся фотографии и добавление в локал сторедж
function likeCat(e) {
    const el = e.target;

    el.classList.toggle("fa-regular");
    el.classList.toggle("fa-solid");

    const index = favoritesCatsList.findIndex((elem) => elem.id === el.previousElementSibling.alt);

    if (index !== -1) {
        favoritesCatsList.splice(index, 1);
        setLocalStorage();
    } else {
        favoritesCatsList.push({ url: el.previousElementSibling.src, id: el.previousElementSibling.alt, icon: "fa-solid" });
        setLocalStorage();
    }
}

// Выбор вкладки всех котиков
function selectAllCats() {
    if(!activePageAllCats){
        allCatsBtn.classList.add("menu__btn_active");
        favoriteCatsBtn.classList.remove("menu__btn_active");

        activePageAllCats = true;
        isLoading = true;

        main.innerHTML = "";
        getData();
    }
}

// Выбор вкладки панравившихся котиков
function selectFavoriteCats() {
    allCatsBtn.classList.remove("active");
    favoriteCatsBtn.classList.add("active");
    loading.classList.add('loading-hidden');

    activePageAllCats = false;

    if (favoritesCatsList.length === 0) {
        main.innerHTML = "<h1>Пока ничего нет(((</h1>";
    } else {
        main.innerHTML = "";
        showCats(favoritesCatsList);
    }
}

// Добавление в локал сторедж котиков
function setLocalStorage() {
    localStorage.removeItem("myCat");
    localStorage.setItem("myCat", JSON.stringify(favoritesCatsList));
}

// Бесконечная подгрузка 
function loadMoreContent() {
    getData();
}

favoriteCatsBtn.addEventListener("click", selectFavoriteCats);
allCatsBtn.addEventListener("click", selectAllCats);

// Запуск бесконечной загрузки при скролле 
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMoreContent();
        loading.classList.remove('loading-hidden');
    }
});

// Убирает прелоадер
window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('preloader-hidden'), 1000)
})