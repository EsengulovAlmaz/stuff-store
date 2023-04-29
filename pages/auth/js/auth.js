const signInBtn = document.querySelector(".signIn-btn");
const registerBtn = document.querySelector(".register-btn");
const login = document.querySelector(".login");
const register = document.querySelector(".register");

const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");


registerBtn.addEventListener("click", () => {
  login.classList.remove("login");
  register.classList.add("register-active");
})

signInBtn.addEventListener("click", () => {
  login.classList.add("login");
  register.classList.remove("register-active");
})

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    id: '',
    name: e.target[0].value,
    surname:  e.target[1].value,
    email:  e.target[2].value,
    password:  e.target[3].value,
    favorites: [],
    cart: [],
    orders: []
  }

  fetch("http://localhost:3000/user", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))


    login.classList.remove("login");
    register.classList.add("register-active");
})

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target[0].value;
  const password = e.target[1].value;
  fetch(`http://localhost:3000/user?name=${name}&password=${password}`)
    .then(res => res.json())
    .then(res => {
      localStorage.setItem("user", JSON.stringify(res[0]));
      res.length ? window.open("../../../index.html", "_self") : ""
    })
    .catch(err => console.log())
})