const socket = io();

const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const status = document.getElementById("status");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

document.getElementById("registerBtn").onclick = async () => {
  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  });
  status.textContent = await res.text();
};

document.getElementById("loginBtn").onclick = async () => {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  });
  const msg = await res.text();
  status.textContent = msg;
  if (res.ok) {
    authDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    socket.emit("join", usernameInput.value);
  }
};

document.getElementById("sendBtn").onclick = () => {
  const msg = document.getElementById("message").value;
  socket.emit("chat message", msg);
  document.getElementById("message").value = "";
};

socket.on("chat message", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  document.getElementById("messages").appendChild(div);
});
