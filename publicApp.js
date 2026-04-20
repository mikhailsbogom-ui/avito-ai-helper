</>  JavaScript

let token = localStorage.getItem("token");

async function login() {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);
}

async function generate() {
  const fd = new FormData();
  fd.append("image", file.files[0]);

  const res = await fetch("/generate", {
    method: "POST",
    headers: { Authorization: token },
    body: fd
  });

  const data = await res.json();
  result.innerText = JSON.stringify(data, null, 2);
}

async function autopost() {
  const fd = new FormData();
  fd.append("image", file.files[0]);

  const res = await fetch("/generate/autopost", {
    method: "POST",
    headers: { Authorization: token },
    body: fd
  });

  const data = await res.json();
  result.innerText = JSON.stringify(data, null, 2);
}