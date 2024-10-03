// Initialize transactions and categories as empty arrays
let transactions = [];
let categorySums = {
    "Income/Transfers": 0,
    "Recurring Payments": 0,
    "Food": 0,
    "Transport": 0,
    "Shopping": 0,
    "Others": 0
};

// Function to categorize transactions based on full_transactions.json data
function categorizeTransaction(description) {
    if (description.includes("Transfer") || description.includes("Zelle")) {
        return "Income/Transfers";
    } else if (description.includes("Netflix") || description.includes("Apple") || description.includes("Verizon")) {
        return "Recurring Payments";
    } else if (description.includes("Canteen") || description.includes("Pizza") || description.includes("Joe Coffee") || description.includes("Barn Joo")) {
        return "Food";
    } else if (description.includes("Mta") || description.includes("Paygo") || description.includes("Lyft")) {
        return "Transport";
    } else if (description.includes("Merci Market") || description.includes("Duane Reade") || description.includes("Magvend")|| description.includes("Musinsa")) {
        return "Shopping";
    } else {
        return "Others";
    }
}

function printReceiptEffect() {
    const mainDiv = document.querySelector('.main');
    const printSound = document.getElementById('printSound');
    printSound.play();
    // First, calculate the full height of the content
    const fullHeight = mainDiv.scrollHeight + 'px';
    
    // Set a small delay to ensure the DOM updates
    setTimeout(() => {
        mainDiv.style.height = fullHeight; // Expand the main div to its full content height
    }, 100); // Delay slightly to let the DOM render first
    setTimeout(() => {
        printSound.pause();
        printSound.currentTime = 0; // Reset the audio to the beginning for future playback
    }, 3000);
}

function loadCategoryTotals() {
    const categoryTableBody = document.querySelector('#category-table tbody');
    categoryTableBody.innerHTML = ''; // Clear existing rows

    Object.keys(categorySums).forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category}</td>
            <td>${categorySums[category].toFixed(2)}</td>
        `;
        categoryTableBody.appendChild(row);
    });

    // Trigger the print receipt effect after the table is populated
    printReceiptEffect(); // Now that rows are appended, trigger the receipt expansion
}


// Function to load transactions into the table and calculate category sums
function loadTransactions() {
    
    // Reset category sums
    categorySums = {
        "Income/Transfers": 0,
        "Recurring Payments": 0,
        "Food": 0,
        "Transport": 0,
        "Shopping": 0,
        "Others": 0
    };

    transactions.forEach(transaction => {
        const category = categorizeTransaction(transaction.description);
        categorySums[category] += transaction.amount;
    });

    // Update the category totals in the table
    loadCategoryTotals();

    // After loading transactions, update the category chart
     printReceiptEffect()
}

// Function to create a pie chart for categories


// Function to handle file upload
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Parse the JSON data
                const jsonData = JSON.parse(e.target.result);
                transactions = jsonData.transactions; // Assuming 'transactions' is the key in the JSON

                // Update table and chart
                loadTransactions();
            } catch (error) {
                alert('Error parsing JSON. Please upload a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});

//map
var map = L.map('map').setView([40.7128, -74.0060], 12); // Center map on New York

        // Step 4: Add a Tile Layer (from OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Step 5: Add Markers for Each Transaction Location
        var locations = [
            { name: "Champion Pizza", lat: 40.7371, lon: -73.9929 },
            { name: "Sprove Market Place", lat: 40.7282, lon: -74.0776 },
            { name: "Merci Market", lat: 40.7580, lon: -73.9855 },
            { name: "Barn Joo - Union Sq", lat: 40.7359, lon: -73.9911 },
            { name: "Joe Coffee - Gover", lat: 40.7506, lon: -73.9937 },
            { name: "Duane Reade Sto 110 NE Jersey City NJ", lat: 40.7282, lon: -74.0776 },
            { name: "Magvend LLC Farmingdale NY", lat: 40.7326, lon: -73.4466 },
            { name: "Tst* Joe Coffee - Gover New York NY", lat: 40.7506, lon: -73.9937 },
            { name: "Barn Joo - Union Sq New York NY", lat: 40.7367, lon: -73.9906 },
            { name: "Path Tapp Paygo Cp New Jersey NJ", lat: 40.7323, lon: -74.0621 },
            { name: "Metro Market Space B New York NY", lat: 40.7527, lon: -73.9772 }
                ];

        locations.forEach(function(location) {
            L.marker([location.lat, location.lon])
                .addTo(map)
                .bindPopup(location.name)
                .openPopup();
        });