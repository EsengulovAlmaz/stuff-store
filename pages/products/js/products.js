const productsRow = document.querySelector(".mens__row");
const mensPagination = document.querySelector(".mens__pagination");
const mensSearch = document.querySelector(".mens__search");
const priceFrom = document.querySelector(".mens__from");
const productsSelect = document.querySelector(".mens__select");

const userBtn = document.querySelector(".header__user-btn");
const userName = document.querySelector(".header__user-name");

let page = 1;

const getActiveLink = () => {
  const asideItems = document.querySelectorAll(".aside__item");
  const title = document.querySelector(".mens__title");
  Array.from(asideItems).forEach((item) => {
    if (location.search === item.getAttribute("href")) {
      item.classList.add("active");
      title.textContent = item.textContent;
    }
  })
}
getActiveLink();

const getAllProducts = (title = "", from = 0, sort = "") => {
  let select = sort.length ? `_sort=price&_order=${sort}` : "";
  let category = location.search.includes("all") ? "" : `category_like=${location.search.split("=")[1]}`;
  fetch(`http://localhost:3000/products?${category}&title_like=${title}&price_gte=${from}&${select}`)
    .then(res => res.json())
    .then(res => showButtons(Math.ceil(res.length / 5)))
}
getAllProducts();

const getPage = (title = "", from = 0, sort = "") => {
  let select = sort.length ? `_sort=price&_order=${sort}` : "";
  let category = location.search.includes("all") ? "" : `category_like=${location.search.split("=")[1]}`;
  fetch(`http://localhost:3000/products?${category}&_page=${page}&_limit=5&title_like=${title}&price_gte=${from}&${select}`)
    .then(res => res.json())
    .then(res => showCards(res))
};
getPage();



function showCards(data) {
  productsRow.innerHTML = data.map(item => `
  <div class="trending__card">
    <a href="../product/index.html?product=${item.id}">
      <img src="${item.image}" alt="" class="trending__card-img">
      <div class="trending__card-info">
        <h3 class="trending__card-title">
          ${item.title}
        </h3>
        <p class="trending__card-category">
          ${item.category}
        </p>
        <div class="trending__card-bottom">
          <p class="trending__card-price">
            ${item.price}
            <span class="trending__card-oldPrice">
              79$
            </span>
          </p>
          <div class="trending__card-purchased">
            ${item.rating.count} people purchased
          </div>
        </div>
      </div>
    </a>
  </div>
  `).join("")
}

function showButtons(numbers) {
  mensPagination.innerHTML = new Array(numbers).fill(numbers).map((item, index) => `
    <button 
      style="background: ${page === index + 1 ? '#212123' : '#6C3EB8'}" 
      class="mens__pagination-btn btn">
      ${index + 1}
    </button>
  `).join("")

  const paginationBtn = document.querySelectorAll(".mens__pagination-btn");
  Array.from(paginationBtn).forEach(item => {
    item.addEventListener("click", () => {
      page = item.textContent;
      getPage();

      Array.from(paginationBtn).forEach(el => {
        if (page === el.textContent) {
          el.style.background = '#212123';
        } else {
          el.style.background = '#6C3EB8';
        }
      })
    })
  })
}

function values() {
  getAllProducts(mensSearch.value, priceFrom.value, productsSelect.value);
  getPage(mensSearch.value, priceFrom.value, productsSelect.value);
}

mensSearch.addEventListener("input", values);
priceFrom.addEventListener("input", values);
productsSelect.addEventListener("change", values);



userBtn.addEventListener("click", () => {
  window.open("../../pages/auth/index.html", "_self");
  localStorage.clear();
});

if(localStorage.getItem("user")) {
  const user = JSON.parse(localStorage.getItem("user"));
  userName.textContent = user.name;
  userBtn.textContent = "Выйти";
} else {
  userBtn.textContent = "Войти";
}