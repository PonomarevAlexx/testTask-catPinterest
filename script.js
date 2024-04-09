const API_KEY = "live_GQbPwFOIhAnXcfZXEULbqMKCqySATmd1fKoFdNxxYoDY5gX2zpQakmYd4nl23mxl";

const main = document.querySelector(".photo-container");
const allCatsBtn = document.querySelector("#all-cats");
const favoriteCatsBtn = document.querySelector("#favorite-cats");
const preloader = document.querySelector('.photo-container__preloader');
const loading = document.querySelector('.loading');

const favoritesCatsList = JSON.parse(localStorage.getItem("myCat")) || [];
let listCats = [];
let activePageAllCats = true;  // что бы не загружал котиков не на той вкладке
let isLoading = true;

// Получаем данные от сервера
function getData() {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=20&api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
        if(activePageAllCats && isLoading) {
            listCats = [...data];
            showCats(listCats);
            isLoading = false;
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
    photoItem.classList.add("photo-container__item");
    photoItem.innerHTML = `
        <img src="${url}" alt="${id}"></img>
        <i class="${icon} fa-heart photo-container__icon"></i>
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
        if(!activePageAllCats) {
            main.innerHTML = "";
            showCats(favoritesCatsList);
        }
    } else {
        favoritesCatsList.push({ url: el.previousElementSibling.src, id: el.previousElementSibling.alt, icon: "fa-solid" });
        setLocalStorage();
    }  
}

// Выбор вкладки всех котиков
function selectAllCats() {
    allCatsBtn.classList.add("menu__btn_active");
    favoriteCatsBtn.classList.remove("menu__btn_active");

    activePageAllCats = true;
    isLoading = true;

    main.innerHTML = "";
    getData();
}

// Выбор вкладки панравившихся котиков
function selectFavoriteCats() {
    allCatsBtn.classList.remove("menu__btn_active");
    favoriteCatsBtn.classList.add("menu__btn_active");
    loading.classList.add('loading_hidden');

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
    isLoading = true;
    getData();
}

favoriteCatsBtn.addEventListener("click", selectFavoriteCats);
allCatsBtn.addEventListener("click", selectAllCats);

// Запуск бесконечной загрузки при скролле 
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && activePageAllCats) {
        loadMoreContent();
        loading.classList.remove('loading_hidden');
    }
});

// Убирает прелоадер
window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('photo-container__preloader_hidden'), 1000)
})