const API_URL = "http://localhost:8000";
const wrapper = document.querySelector(".wrapper");
const form = document.querySelector(".form");
const fnameInput = document.querySelector("#fname");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

let usersData = [];
async function fetchData(api) {
  try {
    let response = await fetch(`${api}/users`);
    let res = await response.json();
    usersData = res.payload;
    createCard(usersData);
  } catch (error) {
    console.log(error);
  }
}

function createCard(data) {
  wrapper.innerHTML = ""; // Clear previous content
  data.forEach((user) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = user.id;
    card.innerHTML = `
      <img src="https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="">
      <h1>${user.fname}</h1>
      <p>${user.username}</p>
      <button class="card__delete-btn">Delete</button>
    `;
    wrapper.appendChild(card);
  });
}

// Function to create a new user
async function createData(api, user) {
  try {
    let response = await fetch(`${api}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    let res = await response.json();
    fetchData(api);
  } catch (error) {
    console.log(error);
    // Optionally display an error message to the user
  }
}

// Event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let usernameExists = usersData.some(
    (user) => user.username === usernameInput.value
  );
  if (usernameExists) {
    alert("Bu username mavjud. Iltimos, boshqa username kiriting.");
  } else {
    let user = {
      fname: fnameInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    };
    createData(API_URL, user);
    form.reset(); // Clear the form fields
  }
});

// Event listener for delete buttons
// wrapper.addEventListener("click", (e) => {
//   if (e.target.classList.contains("card__delete-btn")) {
//     let id = e.target.closest(".card").dataset.id;
//     fetch(`${API_URL}/users/${id}`, {
//       method: "DELETE",
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         console.log(res);
//         fetchData(API_URL);
//       })
//       .catch((error) => {
//         console.log(error);
//         // Optionally display an error message to the user
//       });
//   }
// });

// Initial fetch of data
fetchData(API_URL);
