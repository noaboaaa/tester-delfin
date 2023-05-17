"use strict";

const endpoint = "https://restinpeace-4a0bb-default-rtdb.firebaseio.com/";
let posts = [];

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired");
    initApp();
});


//====================INITAPP==========================//

function initApp() {
  console.log("app is running");
  updatePostsGrid();

  //---------register--------//

  /*document
    .querySelector("#open-register-dialog")
    .addEventListener("click", showRegistrationForm);

  document
    .querySelector("#close-register-dialog")
    .addEventListener("click", hideRegistrationForm);

  document
    .querySelector("#registration-form")
    .addEventListener("submit", registrationFormSubmitted);*/

  //---------update form --------//
  document
    .getElementById("updateForm")
    .addEventListener("submit", updateFormSubmitted);

  document
    .getElementById("updateCloseBtn")
    .addEventListener("click", closeUpdateForm);


}

// ====================== get posts =========================== //
async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  const postObjects = Object.entries(data).map(([id, post]) => ({
    ...post,
    id,
  }));
  return postObjects;
}
async function updatePostsGrid() {
  try {
    posts = await getPosts();
    const postContainer = document.getElementById("post-container");

    postContainer.innerHTML = "";

    posts.forEach((post, index) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      postElement.dataset.index = index;

      postElement.innerHTML = `
        <h2>${post.name}</h2>
        <p>Email: ${post.email}</p>
        <p>Age: ${post.age}</p>
        <p>Membership Type: ${post.membershipType}</p>
        <p>Swimmer Type: ${post.swimmerType}</p>
        <button class="update-btn">Update</button>
      `;

      postContainer.appendChild(postElement);
    });

    postContainer.addEventListener("click", function (event) {
      console.log("update clicked");
      if (event.target.classList.contains("update-btn")) {
        const index = event.target.parentNode.dataset.index;
        openUpdateForm(posts[index]);
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}




function openUpdateForm(post) {
    console.log(post);
  document.getElementById("update-name").value = post.name;
  document.getElementById("update-email").value = post.email;
  document.getElementById("update-age").value = post.age;
  document.getElementById("update-membershipType").value = post.membershipType;
  document.getElementById("update-activity").value = post.swimmerType;

  document.getElementById("updateForm").dataset.postId = post.id;

  document.getElementById("updateFormContainer").style.display = "block";
}


async function updateFormSubmitted(event) {
  event.preventDefault();

  const updatedPost = {
    id: document.getElementById("updateForm").dataset.postId,
    name: document.getElementById("update-name").value,
    email: document.getElementById("update-email").value,
    age: document.getElementById("update-age").value,
    membershipType: document.getElementById("update-membershipType").value,
    swimmerType: document.getElementById("update-activity").value,
  };

  await updatePost(updatedPost);

  closeUpdateForm();
}

function closeUpdateForm() {
  document.getElementById("updateFormContainer").style.display = "none";
}



