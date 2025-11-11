// Your Firebase Config (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authSection = document.getElementById("auth-section");
const chatSection = document.getElementById("chat-section");
const messagesDiv = document.getElementById("messages");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("messageInput");

document.getElementById("loginBtn").onclick = () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value).catch(alert);
};

document.getElementById("registerBtn").onclick = () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value).catch(alert);
};

document.getElementById("logoutBtn").onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    authSection.classList.add("hidden");
    chatSection.classList.remove("hidden");
    loadMessages();
  } else {
    authSection.classList.remove("hidden");
    chatSection.classList.add("hidden");
  }
});

function loadMessages() {
  db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.textContent = `${msg.user}: ${msg.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

document.getElementById("sendBtn").onclick = () => {
  const user = auth.currentUser;
  if (messageInput.value.trim()) {
    db.collection("messages").add({
      user: user.email.split("@")[0],
      text: messageInput.value.trim(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = "";
  }
};
