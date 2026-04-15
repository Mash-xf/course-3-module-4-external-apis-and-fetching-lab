const weatherApi = "https://api.weather.gov/alerts/active?area=";

function isValidStateCode(state) {
  return /^[A-Z]{2}$/.test(state);
}

function clearError() {
  const errorMessage = document.querySelector("#error-message");

  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function showError(message) {
  const errorMessage = document.querySelector("#error-message");
  const alertsDisplay = document.querySelector("#alerts-display");

  alertsDisplay.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function displayAlerts(data) {
  const alertsDisplay = document.querySelector("#alerts-display");
  const alerts = data.features || [];
  const summary = document.createElement("p");
  const headlinesList = document.createElement("ul");

  alertsDisplay.innerHTML = "";
  summary.textContent = `${data.title}: ${alerts.length}`;
  alertsDisplay.append(summary);

  alerts.forEach((alert) => {
    const listItem = document.createElement("li");
    listItem.textContent = alert.properties.headline;
    headlinesList.append(listItem);
  });

  alertsDisplay.append(headlinesList);
}

function fetchWeatherAlerts(state) {
  return fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      console.log(data);
      clearError();
      displayAlerts(data);
      return data;
    })
    .catch((errorObject) => {
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

function handleFetchClick() {
  const stateInput = document.querySelector("#state-input");
  const state = stateInput.value.trim().toUpperCase();

  stateInput.value = "";

  if (!state) {
    showError("Please enter a state abbreviation.");
    return;
  }

  if (!isValidStateCode(state)) {
    showError("Please enter a valid two-letter state abbreviation.");
    return;
  }

  fetchWeatherAlerts(state);
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.querySelector("#fetch-alerts");

  fetchButton.addEventListener("click", handleFetchClick);
});

if (typeof module !== "undefined") {
  module.exports = {
    clearError,
    displayAlerts,
    fetchWeatherAlerts,
    handleFetchClick,
    isValidStateCode,
    showError,
  };
}
