const trendRow = document.querySelector(".trending__row");
const trendBtn = document.querySelector(".trend__btn");
const lessRow = document.querySelector(".less__row");
const lessBtn = document.querySelector(".less__btn");

const userBtn = document.querySelector(".header__user-btn");
const userName = document.querySelector(".header__user-name");


/*TRENDS*/
const getAllTrends = (limit = 5) => {
  fetch(`http://localhost:3000/products?_sort=rating.rate&_order=desc&_limit=${limit}`)
    .then(res => res.json())
    .then(res => showCards(res, trendRow))
};
getAllTrends();

trendBtn.addEventListener("click", () => {
  if (trendBtn.textContent === "Hide") {
    trendBtn.textContent = "See more";
    getAllTrends();
  } else {
    trendBtn.textContent = "Hide";
    getAllTrends(10);
  }
});



/*LESS THAN 100*/
const getAllLess = (limit = 5) => {
  fetch(`http://localhost:3000/products?price_lte=100&_limit=${limit}`)
    .then(res => res.json())
    .then(res => showCards(res, lessRow))
};
getAllLess();

lessBtn.addEventListener("click", () => {
  if (lessBtn.textContent === "Hide") {
    lessBtn.textContent = "See more";
    getAllLess();
  } else {
    lessBtn.textContent = "Hide";
    getAllLess(10);
  }
})



/*SHOWCARD*/
function showCards(data, template) {
  template.innerHTML = data.map(item => `
  <div class="trending__card">
    <a href="pages/product/index.html?product=${item.id}">
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