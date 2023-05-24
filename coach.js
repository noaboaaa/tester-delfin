"use strict";

// ====================== Constants =========================== //

const endpoint = "https://restinpeace-4a0bb-default-rtdb.firebaseio.com/";
let posts = [];

// ====================== Event Listeners =========================== //

document.addEventListener("DOMContentLoaded", (event) => {
  // Dialogs
  const tournamentResultsDialog = document.querySelector(
    "#tournamentResultsDialog"
  );
  const trainingResultsDialog = document.querySelector(
    "#trainingResultsDialog"
  );

  const closeTournamentResultsButton = document.querySelector(
    "#closeTournamentResultsButton"
  );
  const closeTrainingResultsButton = document.querySelector(
    "#closeTrainingResultsButton"
  );
  closeTournamentResultsButton.addEventListener("click", () => {
    tournamentResultsDialog.classList.add("hidden");
  });

  closeTrainingResultsButton.addEventListener("click", () => {
    trainingResultsDialog.classList.add("hidden");
  });

  console.log("DOMContentLoaded event fired");
  initApp();
});

// ====================== INITAPP =========================== //

function initApp() {
  console.log("App is running");
  updatePostsGrid();
}
// ====================== Get Posts =========================== //

async function getPosts() {
  try {
    const response = await fetch(`${endpoint}/posts.json`);
    const data = await response.json();
    console.log("Fetched posts in getPosts:", data); // Add this line

    const postObjects = Object.entries(data).map(([postId, post]) => ({
      id: postId,
      ...post,
    }));
    console.log("Transformed posts:", postObjects);

    const competitiveSwimmers = postObjects.filter(
      (post) => post.swimmerType === "competitive"
    );

    return competitiveSwimmers;
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
}
async function updatePostsGrid() {
  try {
    posts = await getPosts();
    console.log("Fetched posts:", posts); // Log the fetched posts

    const postContainer = document.querySelector("#post-container");
    postContainer.innerHTML = "";

    posts.forEach((post, index) => {
      console.log("Updating UI for post:", post); // Log the current post being processed

      const postElement = document.createElement("div");
      postElement.classList.add("post");

      postElement.innerHTML = `
        <h2>${post.name}</h2>
        <p>Age: ${post.age}</p>
        <p>Team: ${post.team}</p>
        <button class="view-training-results">View training results</button>
        <button class="update-training-results">Update training results</button>
        <button class="view-tournament-results">View tournament results</button>
        <button class="update-tournament-results">Update tournament results</button>
      `;

      const viewTrainingResultsButton = postElement.querySelector(
        ".view-training-results"
      );
      const updateTrainingResultsButton = postElement.querySelector(
        ".update-training-results"
      );
      const viewTournamentResultsButton = postElement.querySelector(
        ".view-tournament-results"
      );
      const updateTournamentResultsButton = postElement.querySelector(
        ".update-tournament-results"
      );

      viewTrainingResultsButton.addEventListener("click", () => {
        openTrainingResultsDialog(post);
      });

      updateTrainingResultsButton.addEventListener("click", () => {
        openUpdateTrainingResultsForm(post);
      });

      viewTournamentResultsButton.addEventListener("click", () => {
        openTournamentResultsDialog(post);
      });

      updateTournamentResultsButton.addEventListener("click", () => {
        openUpdateTournamentResultsForm(post);
      });

      postContainer.appendChild(postElement);
    });

    console.log("Updated UI:", postContainer.innerHTML); // Log the updated UI
  } catch (error) {
    console.error("Error updating posts grid:", error);
  }
}

// ======================================= TOURNAMENT DIALOG======================================= //

function openTournamentResultsDialog(post) {
  console.log("Opening tournament results dialog for: ", post);

  const dialog = document.querySelector("#tournamentResultsDialog");
  const content = document.querySelector("#tournamentResultsContent");

  content.innerHTML = "";

  post.tournamentResults.forEach((result) => {
    content.innerHTML += `
      <h2>Tournament Results</h2>
      <h3>${post.name}</h3>
      <p>Tournament: ${result.tournament}</p>
      <p>Rank: ${result.rank}</p>
      <p>Time: ${result.time}</p>
    `;
  });

  dialog.classList.remove("hidden");
}

function closeTournamentResultsDialog() {
  const dialog = document.querySelector("#tournamentResultsDialog");
  dialog.classList.add("hidden");
}

const closeTournamentResultsButton = document.querySelector(
  "#closeTournamentResultsButton"
);
closeTournamentResultsButton.addEventListener(
  "click",
  closeTournamentResultsDialog
);

// =======================================TRAINING DIALOG======================================= //
function openTrainingResultsDialog(post) {
  console.log("Opening training results dialog for: ", post);

  const dialog = document.querySelector("#trainingResultsDialog");
  const content = document.querySelector("#trainingResultsContent");

  content.innerHTML = "";

  post.trainingResults.forEach((result) => {
    content.innerHTML += `
      <h2>Training Results</h2>
      <h3>${post.name}</h3>
      <p>Discipline: ${result.discipline}</p>
      <p>Time: ${result.resultTime}</p>
      <p>Date: ${result.date}</p>
    `;
  });

  dialog.classList.remove("hidden");
}

function closeTrainingResultsDialog() {
  const dialog = document.querySelector("#trainingResultsDialog");
  dialog.classList.add("hidden");
}

const closeTrainingResultsButton = document.querySelector(
  "#closeTrainingResultsButton"
);
closeTrainingResultsButton.addEventListener(
  "click",
  closeTrainingResultsDialog
);

// ====================== UPDATE TOURNAMENT RESULTS=========================== //

function openUpdateTournamentResultsForm(post) {
  console.log(
    "openUpdateTournamentResultsForm function called with post: ",
    post
  );

  const formContainer = document.querySelector(
    "#updateTournamentResultsFormContainer"
  );
  const form = document.querySelector("#updateTournamentResultsForm");

  formContainer.style.display = "block";

  form.dataset.postId = post.id;
  form.querySelector("#add-tournament-number").value = "";
  form.querySelector("#add-results-time").value = "";
  form.querySelector("#add-time").value = "";
}

const updateTournamentResultsForm = document.querySelector(
  "#updateTournamentResultsForm"
);
updateTournamentResultsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  const postId = form.dataset.postId;

  const tournamentNumber = form.querySelector("#add-tournament-number").value;
  const resultsTime = form.querySelector("#add-results-time").value;
  const time = form.querySelector("#add-time").value;

  const post = posts.find((p) => p.id === postId);

  const newResult = {
    tournament: tournamentNumber,
    rank: resultsTime,
    time: time,
  };

  post.tournamentResults.push(newResult);

  try {
    const response = await fetch(`${endpoint}/posts/${postId}.json`, {
      method: "PATCH",
      body: JSON.stringify({ tournamentResults: post.tournamentResults }),
    });
    const responseBody = await response.json();
    console.log("PATCH response body:", responseBody); // Add this line
  } catch (error) {
    console.error("Error updating tournament results:", error);
  }

  openTournamentResultsDialog(post);

  const formContainer = document.querySelector(
    "#updateTournamentResultsFormContainer"
  );
  formContainer.style.display = "none";
});

// ====================== UPDATE TRAINING RESULTS=========================== //

function openUpdateTrainingResultsForm(post) {
  console.log(
    "openUpdateTrainingResultsForm function called with post: ",
    post
  );

  const formContainer = document.querySelector(
    "#updateTrainingResultsFormContainer"
  );
  const form = document.querySelector("#updateTrainingResultsForm");

  formContainer.style.display = "block";

  form.dataset.postId = post.id;
  form.querySelector("#add-discipline").value = "";
  form.querySelector("#add-results-time").value = "";
  form.querySelector("#add-date").value = "";
}

const updateTrainingResultsForm = document.querySelector(
  "#updateTrainingResultsForm"
);
updateTrainingResultsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  const postId = form.dataset.postId;

  const discipline = form.querySelector("#add-discipline").value;
  const resultTime = form.querySelector("#add-results-time").value;
  const date = form.querySelector("#add-date").value;

  const post = posts.find((p) => p.id === postId);

  const newResult = {
    discipline: discipline,
    resultTime: resultTime,
    date: date,
  };

  post.trainingResults.push(newResult);

  try {
    const response = await fetch(`${endpoint}/posts/${postId}.json`, {
      method: "PATCH",
      body: JSON.stringify({ trainingResults: post.trainingResults }),
    });
    console.log("PATCH response:", response);
  } catch (error) {
    console.error("Error updating training results:", error);
  }

  openTrainingResultsDialog(post);

  const formContainer = document.querySelector(
    "#updateTrainingResultsFormContainer"
  );
  formContainer.style.display = "none";
});

// ======================TOP 5 =========================== //

// Event listeners for the filter buttons
document
  .getElementById("junior-filter-button")
  .addEventListener("click", () => {
    openTopSwimmersDialog("junior");
  });

document
  .getElementById("senior-filter-button")
  .addEventListener("click", () => {
    openTopSwimmersDialog("senior");
  });

function openTopSwimmersDialog(team) {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog");
  dialog.id = "topSwimmersDialog";
  dialog.innerHTML = `
    <h2>Top Swimmers - ${team.charAt(0).toUpperCase() + team.slice(1)} Team</h2>
    <div id="topSwimmersContent"></div>
    <button id="closeTopSwimmersButton">Close</button>
  `;

  const closeTopSwimmersButton = dialog.querySelector(
    "#closeTopSwimmersButton"
  );
  closeTopSwimmersButton.addEventListener("click", () => {
    dialog.remove();
  });

  const topSwimmersContent = dialog.querySelector("#topSwimmersContent");
  const topSwimmers = getTopSwimmersByTeam(team);
  const disciplines = Object.keys(topSwimmers);

  disciplines.forEach((discipline) => {
    const disciplineElement = document.createElement("div");
    disciplineElement.innerHTML = `<h3>${
      discipline.charAt(0).toUpperCase() + discipline.slice(1)
    }</h3>`;

    topSwimmers[discipline].forEach((swimmer, index) => {
      const swimmerElement = document.createElement("div");
      swimmerElement.innerText = `${index + 1}. ${
        swimmer.name
      }: ${secondsToTime(swimmer.bestTime)}`;
      disciplineElement.appendChild(swimmerElement);
    });

    topSwimmersContent.appendChild(disciplineElement);
  });

  document.body.appendChild(dialog);
}

let postsArray = Object.values(posts);

// Function to convert time string into seconds for comparison
function timeToSeconds(time) {
  let parts = time.split(":");
  return parts[0] * 60 + parseFloat(parts[1]);
}

function getTopSwimmersByTeam(team) {
  const teamSwimmers = postsArray.filter((post) => post.team === team);
  const disciplines = ["Backcrawl", "Butterfly", "Breaststroke", "Freestyle"];
  const topSwimmers = {};

  disciplines.forEach((discipline) => {
    topSwimmers[discipline] = [];

    teamSwimmers.forEach((swimmer) => {
      const times = swimmer.trainingResults
        .filter((result) => result.discipline === discipline)
        .map((result) => timeToSeconds(result.resultTime));

      const bestTime = times.length > 0 ? Math.min(...times) : Infinity;

      if (bestTime !== Infinity) {
        topSwimmers[discipline].push({
          name: swimmer.name,
          discipline: swimmer.discipline,
          bestTime: swimmer.bestTime,
        });
      }
    });

    topSwimmers[discipline].sort((a, b) => a.bestTime - b.bestTime);
    topSwimmers[discipline] = topSwimmers[discipline].slice(0, 5);
  });

  return topSwimmers;
}

function secondsToTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secondsLeft = (seconds - minutes * 60).toFixed(2);
  return minutes + ":" + (secondsLeft < 10 ? "0" : "") + secondsLeft;
}
