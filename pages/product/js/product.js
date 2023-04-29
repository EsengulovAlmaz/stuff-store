const title = document.querySelector(".product__info-title");
const price = document.querySelector(".product__info-price");
const category = document.querySelector(".product__info-category-text");
const rating = document.querySelector(".product__info-rating-num");
const description = document.querySelector(".product__info-desc");
const image = document.querySelector(".product__image");
const addCard = document.querySelector(".product__add-cart");
const addFavorites = document.querySelector(".product__add-favorites");
const trendRow = document.querySelector(".trending__row");

const user = JSON.parse(localStorage.getItem("user"));

const getOneProduct = () => {
  fetch(`http://localhost:3000/products/${location.search.split('=')[1]}`)
    .then(res => res.json())
    .then(res => {
      showProduct(res);
      getAllRelatedProducts(res.category, res.id);


      addCard.addEventListener("click", () => {
        if (user) {
          fetch(`http://localhost:3000/user/${user.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cart: user.cart.some(item => item.id === res.id)
                ? user.cart.filter(item => item.id != res.id)
                : [...user.cart, res]
            })
          }).then(res => res.json())
            .then(res => {
              localStorage.setItem("user", JSON.stringify(res));
              getOneProduct();
            });

        } else {
          alert("Вы не зарегистрированы!");
        }
      });

      addFavorites.addEventListener("click", () => {
        fetch(`http://localhost:3000/user/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            favorites: user.favorites.some(item => item.id === res.id)
            ? user.favorites.filter(item => item.id != res.id)
            : [...user.favorites, res]
          })
        }).then(res => res.json())
          .then(res => {
            localStorage.setItem("user", JSON.stringify(res));
            getOneProduct();
          })
      });


      if(user.favorites.some(item => item.id === res.id)) {
        addFavorites.textContent = "Remove from favorites";
      } else {
        addFavorites.textContent = "Add to favorite";
      }

      if(user.cart.some(item => item.id === res.id)) {
        addCard.textContent = "Remove from cart";
      } else {
        addCard.textContent = "Add to cart";
      }
    })
};
getOneProduct();

const getAllRelatedProducts = (prodCategory, id, limit = 5) => {
  fetch(`http://localhost:3000/products?category=${prodCategory}&id_ne=${id}&_limit=${limit}`)
    .then(res => res.json())
    .then(res => showCards(res, trendRow))
}

function showProduct(data) {
  image.src = data.image;
  title.textContent = data.title;
  price.textContent = data.price;
  category.textContent = data.category;
  rating.textContent = data.rating.rate;
  description.textContent = data.description;
  addCard.dataset.id = data.id;
  addFavorites.dataset.id = data.id;
}

function showCards(data, template) {
  template.innerHTML = data.map(item => `
  <div class="trending__card">
    <a href="?product=${item.id}">
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


const userBtn = document.querySelector(".header__user-btn");
const userName = document.querySelector(".header__user-name");

userBtn.addEventListener("click", () => {
  window.open("../../pages/auth/index.html", "_self");
  localStorage.clear();
});

if (localStorage.getItem("user")) {
  const user = JSON.parse(localStorage.getItem("user"));
  userName.textContent = user.name;
  userBtn.textContent = "Выйти";
} else {
  userBtn.textContent = "Войти";
}