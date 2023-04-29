const favoritesRow = document.querySelector(".favorites");

let user = '';
if (localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user"));
}

const getAllFavorites = () => {
  favoritesRow.innerHTML = user.favorites.map(item => `
      <div class="trending__card">
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
              <button data-id="${item.id}" class="trending__card-btn">Delete</button>
            </div>
          </div>
      </div>
    `).join("")
}
getAllFavorites();


const deleteBtn = document.querySelectorAll(".trending__card-btn");

Array.from(deleteBtn).forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    if (user) {
      fetch(`http://localhost:3000/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          favorites: user.favorites.filter(i => i.id != item.dataset.id)
        })
      }).then(res => res.json())
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res));
          getAllFavorites();
        })
    } else {
      alert("Вы не зарегистрированы!");
    }
  })
})



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