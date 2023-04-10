const csvUrl = "badUrl.csv";
const [form, urlInput, domainStatus, malware, urlPasted, malDef, threat] = document.querySelectorAll("form, #url-input, #domain-status, #malware, #url-pasted, #mal-def, #threat");
const elementsColor = ["#domain-status", "#malware", "#url-pasted", "#mal-def", "#threat"];

const loading = document.getElementById('loading');

function changeElementsColor(color) {
  elementsColor.forEach((el) => {
    document.querySelector(el).style.color = color;
  });
}

let dataMap = new Map();

// Show loading element before making the request
loading.style.display = 'block';

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
    const rows = data.split("\n").slice(1);
    rows.forEach(row => {
      const [url, type] = row.split(",");
      if (type) {
        dataMap.set(url, type.trim());
      }
      loading.style.display = 'none';
    });
  })
  .catch(error => console.error(error));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const url = urlInput.value;
  urlInput.value = "";

  const type = dataMap.get(url);
  if (type) {
    domainStatus.textContent = "Unsafe";
    urlPasted.textContent = url;
    if (type === "benign") {
      malware.textContent = "benign";
      malDef.textContent = "A prank virus that does not cause damage.";
      threat.textContent = "Minimal";
    } else if (type === "phishing") {
      malware.textContent = "phishing";
      malDef.textContent = "Deceives people into revealing sensitive information.";
      threat.textContent = "Critical";
    } else if (type === "defacement") {
      malware.textContent = "defacement";
      malDef.textContent = "Where hackers drastically alter the visual appearance of a website.";
      threat.textContent = "Significant";
    }

    changeElementsColor("#E90064");
    
  } else {
    
    domainStatus.textContent = "Safe";
    malware.textContent = "No malware found.";
    urlPasted.textContent = url;
    malDef.textContent = "No malware to define.";
    threat.textContent = "Low";

    changeElementsColor("lime");
  }

});

/* goto button script  */
const gotoBtn = document.getElementById('goto-btn');

gotoBtn.addEventListener('click', () => {
  const url = urlPasted.textContent;
  if (url === "") {
    alert("Please enter a URL in the input box.");
  } else if (domainStatus.textContent === "Unsafe") {
    const malwareType = malware.textContent;
    const malwareDefinition = malDef.textContent;
    const threatLevel = threat.textContent;
    const message = `The URL you are trying to visit is unsafe.\n\nMalware Type: ${malwareType}\nMalware Definition: ${malwareDefinition}\nThreat Level: ${threatLevel}\n\nAre you sure you want to proceed?`;
    if (confirm(message)) {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
});

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration object here
  apiKey: "AIzaSyBeQsHMF4qscROM7u5Z21r8sNLvjmQiGvk",
  authDomain: "test-baa2b.firebaseapp.com",
  databaseURL: "https://test-baa2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-baa2b",
  storageBucket: "test-baa2b.appspot.com",
  messagingSenderId: "236918427679",
  appId: "1:236918427679:web:eb7b59b1388451d6e4052a"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

// Get a reference to the report button
const reportBtn = document.getElementById('report-btn');

// Add an event listener to the report button
reportBtn.addEventListener('click', () => {
  const url = urlPasted.textContent;

  if (!url) {
    alert("Please enter a URL in the input box.");
    return;
  }

  // Send the URL to the Firestore database
  db.collection("urlReported").add({
    url: url
  })
  .then(() => {
    console.log("URL reported successfully");
    alert("URL reported successfully.");
  })
  .catch((error) => {
    console.error("Error reporting URL: ", error);
    alert("Error reporting URL.");
  });
});