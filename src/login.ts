import { createElement } from "./util";

export const login = () => {
  const username = createElement("input", "username") as HTMLInputElement;
  username.setAttribute("placeholder", "Username");
  username.required = true;

  const password = createElement("input", "password") as HTMLInputElement;
  password.setAttribute("placeholder", "Password");
  password.setAttribute("type", "password");
  password.required = true;

  const login = createElement("button", "login") as HTMLButtonElement;
  login.setAttribute("type", "submit");

  login.textContent = "Login";
  login.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("login baby");
    const body = {
      username: username.value,
      password: password.value,
    };
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
      username.className = "hidden";
      password.className = "hidden";
      login.className = "hidden";
      loggedIn.textContent = username.value;
      logout.className = "";
      loggedIn.className = "";
    } else {
      console.log("oi!");
    }
  });

  const logout = createElement("button", "logout") as HTMLButtonElement;
  logout.setAttribute("type", "submit");
  logout.textContent = "Logout";
  logout.className = "hidden";
  logout.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("logout baby");
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.status === 200) {
      username.className = "";
      password.className = "";
      login.className = "";
      logout.className = "hidden";
      loggedIn.className = "hidden";
      loggedIn.textContent = "";
    } else {
      console.log("oi!");
    }
  });
  const loggedIn = createElement("span", "logged-in") as HTMLSpanElement;
  loggedIn.className = "hidden";

  const row = createElement("form", "login-row") as HTMLFormElement;
  [username, password, loggedIn, login, logout].forEach((element) => {
    row.appendChild(element);
  });
  return row;
};
