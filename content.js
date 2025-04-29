const outerContainer = document.createElement("div");
outerContainer.style.cssText = `
  position: fixed;
  top: 10px;
  right: 80px;
  width: 300px;
  background-color: #121212;
  border-radius: 25px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2px; /* Spacing for the inner border */
  z-index: 10000;
`;
let isDragging = false;
let offsetX, offsetY;
// Disable default drag-and-drop for images within the container
outerContainer.addEventListener("dragstart", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});
outerContainer.addEventListener("mousedown", (event) => {
  // Prevent dragging when clicking buttons or other interactive elements
  const target = event.target;
  if (
    target.tagName === "BUTTON" || 
    target.id === "dismiss-modal" ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  ) {
    return;
  }
  isDragging = true;
  offsetX = event.clientX - outerContainer.offsetLeft;
  offsetY = event.clientY - outerContainer.offsetTop;
  outerContainer.style.cursor = "grabbing";
});
document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;
  outerContainer.style.left = `${event.clientX - offsetX}px`;
  outerContainer.style.top = `${event.clientY - offsetY}px`;
});
document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  outerContainer.style.cursor = "default";
});

const innerContainer = document.createElement("div");
innerContainer.id = "order-summary-container";
innerContainer.style.cssText = `
  background-color: #14181b;
  border: 2px solid #a8d3d6;
  border-radius: 23px; /* Adjust for inner border */
  padding: 10px;
  font-family: Arial, sans-serif;
`;
// Nest the inner container inside the outer container
outerContainer.appendChild(innerContainer);
// Add fade-in effect when creating the outer container
outerContainer.style.opacity = "0";
outerContainer.style.transition = "opacity 0.5s ease-in";
document.body.appendChild(outerContainer);

// Change this block to avoid redeclaring the 'overlay' identifier
// Add a guard to check if 'overlay' already exists
setTimeout(() => {
  let overlay = document.getElementById("gray-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "gray-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(34, 34, 34, 0.6); /* Darker gray translucent film */
      z-index: 9999; /* Should be on top of most elements */
      pointer-events: none; /* Ensure it doesn't block interactions */
      opacity: 0; /* Start fully transparent */
      transition: opacity 2s ease-in; /* Smooth fade-in over 2 seconds */
    `;
    // Set initial opacity to 1 after adding the overlay to trigger fade-in
    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 0);
    // Append the overlay to the document body
    document.body.appendChild(overlay);
  }
  // Listen for the first click to remove the overlay
  document.addEventListener(
    "click",
    () => {
      const overlayElement = document.getElementById("gray-overlay");
      if (overlayElement) {
        overlayElement.style.transition = "opacity 0.3s ease-out";
        overlayElement.style.opacity = "0"; // Fade out the overlay
        setTimeout(() => overlayElement.remove(), 300); // Remove after fade-out
      }
    },
    { once: true } // Ensure the listener fires only once
  );
}, 1000); // Delay the overlay by 1 second

// Trigger the fade-in for the floating window immediately after appending
setTimeout(() => {
  outerContainer.style.opacity = "1";
}, 0); // Immediate fade-in for the floating window

// Add content to the floating window
// Add logo URL and modify container content
const logoURL = "https://imgur.com/hjecnq6.gif"; // Replace with your actual Imgur URL
// Add content to the floating window
innerContainer.innerHTML = `
  <a href="https://cashcat.ai" target="_blank" style="text-decoration: none; color: inherit;">
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
      <img src="${logoURL}" alt="Logo" style="width: 60px; height: 60px; margin-right: 10px;">
      <div>
        <h3 style="text-align: center; margin: 0; font-size: 30px; color: #f0f4f5;">CA$H CAT</h3>
        <p style="text-align: center; margin: 0; font-size: 16px; font-style: italic; color: #f0f4f5;">Get Paid to Shop!</p>
      </div>
    </div>
  </a>
  <div style="width: 95%; height: 2px; background-color: #f0f4f5; margin: 0 auto 10px;"></div>
  <table id="order-summary-table" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid #121212; background-color: #121212; padding: 4px; color: #f0f4f5; text-align: left;">Order Summary</th>
        <th style="border: 1px solid #121212; background-color: #121212; padding: 4px; color: #f0f4f5; text-align: left;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <!-- Data will be dynamically populated -->
    </tbody>
  </table>
`;



// Append the floating window to the body
document.body.appendChild(outerContainer);
// Function to scrape the order summary table
function scrapeOrderSummary() {
  const table =
    document.querySelector("#subtotals-marketplace-table") || 
    document.querySelector("[data-name='subtotals-table']");
  if (!table) return [];
  const rows = Array.from(table.querySelectorAll("tr"));
  return rows.map((row) => ({
    item: row.querySelector("td:first-child")?.innerText.trim() || "",
    amount: row.querySelector("td:last-child")?.innerText.trim() || "",
  }));
}
// Function to update the floating window table
function updateOrderSummary() {
    const data = scrapeOrderSummary();
    const tableBody = innerContainer.querySelector("#order-summary-table tbody");
  
    // Clear the table
    tableBody.innerHTML = "";
  
    let totalBeforeTax = null; // Use null to track missing values
    let orderTotal = null;
  
    // Populate table and extract required values
    data.forEach(({ item, amount }) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="border: 1px solid #121212; color: #f0f4f5; padding: 4px;">${item}</td>
        <td style="border: 1px solid #121212; color: #f0f4f5; padding: 4px;">${amount}</td>
      `;
      tableBody.appendChild(row);
  
    // Handle localization for amazon.ca and amazon.com
    const localizedMap = {
      "Total before tax": ["Total before tax", "Sous-total avant taxes"],
      "order total": ["Order Total", "Total de la commande"],
    };

    if (localizedMap["Total before tax"].some((term) => item.includes(term))) {
      totalBeforeTax = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    }
    if (localizedMap["order total"].some((term) => item.includes(term))) {
      orderTotal = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    }
    });
  
    // Debugging logs -- Enable if calcuilation is incorrect
    //console.log("Scraped Data:", data);
    //console.log("Total before tax:", totalBeforeTax);
    //console.log("Order Total:", orderTotal);
  
    // Skip if we couldn't find the required values
    if (totalBeforeTax === null || orderTotal === null) {
      console.error("Missing required values for calculations. Skipping update.");
      return;
    }
  
    // Calculate the CashCat Discount (always round down)
    const cashCatDiscount = Math.floor(totalBeforeTax * 0.04 * 100) / 100;
    const finalOrderTotal = Math.floor((orderTotal - cashCatDiscount) * 100) / 100;
  
    // Add a blank line row above the CashCat Discount
    const blankRow = document.createElement("tr");
    blankRow.innerHTML = `
    <td style="border: none; padding: 4px;" colspan="2"></td>
    `;
    tableBody.appendChild(blankRow);
    // Add CashCat Discount row
    const discountRow = document.createElement("tr");
    discountRow.innerHTML = `
    <td style="border: 1px solid #121212; padding: 4px; font-weight: bold; font-size: 1.2em; color: #bfffc3;">Instant CatCash:</td>
    <td style="border: 1px solid #121212; padding: 4px; font-weight: bold; font-size: 1.2em; color: #bfffc3;">-$${cashCatDiscount.toFixed(2)}</td>
    `;
    tableBody.appendChild(discountRow);
  
// Add updated Order Total row
const totalRow = document.createElement("tr");
totalRow.innerHTML = `
  <td style="border: 1px solid #121212; padding: 4px; padding-bottom: 5px; font-weight: bold; color: #89ff8f; font-size: 1.3em;">CashCat Total:</td>
  <td style="border: 1px solid #121212; padding: 4px; padding-bottom: 5px; font-weight: bold; color: #89ff8f; font-size: 1.3em;">$${finalOrderTotal.toFixed(2)}</td>
`;
tableBody.appendChild(totalRow);
const actionRow = document.createElement("tr");
// Update the clickable line for dismissing the modal
actionRow.innerHTML = `
    <td colspan="2" style="text-align: center; padding-top: 20px; border: none;">
        <button id="place-order-button" class="animated-button">
            Place your order
        </button>
        <div style="margin-top: 10px; font-size: 0.9em; color: #98a4a8; cursor: pointer; text-decoration: underline;" id="dismiss-modal">
            I don't want to earn $${cashCatDiscount}.
        </div>
        <div id="progress-bar-container" style="width: 100%; height: 20px; background-color: #eee; border-radius: 10px; display: none; margin-top: 10px;">
            <div id="progress-bar" style="height: 100%; width: 0%; background-color: #FFD814; border-radius: 10px;"></div>
        </div>
    </td>
`;

// Update event listener for dismissing the modal
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "dismiss-modal") {
        outerContainer.style.transition = "opacity 0.5s ease-out";
        outerContainer.style.opacity = "0";
        setTimeout(() => {
            outerContainer.remove(); // Remove the modal after fade-out
            console.log("Modal dismissed.");
        }, 500);
    }
});

tableBody.appendChild(actionRow);

    
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "place-order-button") {
      const buttonCell = e.target.closest("td"); // Safely get the closest parent <td> element
      if (!buttonCell) {
          console.error("Parent element is null. Cannot update innerHTML.");
          return; // Safely exit if parent is null
      }
      
      // Replace the content of the parent cell with the progress bar
      buttonCell.innerHTML = `
          <div id="progress-bar-container" style="width: 100%; height: 20px; background-color: #eee; border-radius: 10px;">
              <div id="progress-bar" style="height: 100%; width: 0%; background-color: #FFD814; border-radius: 10px;"></div>
          </div>
      `;
      
      // Open a new tab immediately
      const domain = window.location.hostname; // Dynamically detect `amazon.ca` or `amazon.com`
      const currentURL = `https://${domain}/dp/B0B94PNF7P?tag=dummy123&geniuslink=false&th=1`;
      const modifiedURL = currentURL.replace("dummy123", "success123");
      chrome.runtime.sendMessage({ action: "openTab", url: modifiedURL }, (response) => {
          if (response?.status === "tabOpened") {
              console.log("Tab opened successfully.");
          } else {
              console.error("Failed to open tab.");
          }
      });

      // Simulate progress bar filling up
      const progressBar = buttonCell.querySelector("#progress-bar");
      if (!progressBar) {
          console.error("Progress bar element is null. Cannot animate.");
          return; // Safely exit if progress bar is null
      }
      let progress = 0;
      const interval = setInterval(() => {
          progress += 1;
          progressBar.style.width = `${progress}%`;
          if (progress >= 100) {
              clearInterval(interval);
              alert("Order placed successfully!");
          }
      }, 60);
  }
});


// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "tabClosed") {
        console.log("Background tab closed successfully.");
    }
});
}
  
  // Update the table every second to reflect changes
  updateOrderSummary(); // Initial immediate poll
  setInterval(updateOrderSummary, 5000); // Subsequent polls every 5 seconds
  