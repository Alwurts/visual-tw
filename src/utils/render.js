document.addEventListener("mouseover", function (event) {
  var target = event.target;

  var existingOverlay = document.getElementById("hoverOverlay");
  if (existingOverlay) existingOverlay.remove();

  // Get the bounding rectangle of target including margins
  // Get the bounding rectangle of target
  var rect = target.getBoundingClientRect();

  // Get computed style of target
  var style = window.getComputedStyle(target);

  // Calculate margins
  var marginTop = parseInt(style.marginTop);
  var marginBottom = parseInt(style.marginBottom);
  var marginLeft = parseInt(style.marginLeft);
  var marginRight = parseInt(style.marginRight);

  // Create a new overlay
  var overlay = document.createElement("div");
  overlay.id = "hoverOverlay";
  overlay.style.position = "fixed"; // Use fixed positioning
  overlay.style.left = rect.left - marginLeft + "px"; // Subtract marginLeft from left position
  overlay.style.top = rect.top - marginTop + "px"; // Subtract marginTop from top position
  overlay.style.width = rect.width + marginLeft + marginRight + "px"; // Add marginLeft and marginRight to width
  overlay.style.height = rect.height + marginTop + marginBottom + "px"; // Add marginTop and marginBottom to height
  overlay.style.border = "2px solid rgba(0, 50, 150, 0.5)"; // Border with semi-transparent color
  overlay.style.backgroundColor = "transparent"; // Transparent background
  overlay.style.pointerEvents = "none"; // Add this line

  // Add the title to the overlay
  var tagName = document.createElement("div");
  tagName.innerText = target.tagName; // Set the tag name as the title
  tagName.style.position = "absolute";
  tagName.style.top = "0";
  tagName.style.left = "0";
  tagName.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  tagName.style.color = "white";
  tagName.style.padding = "4px";

  overlay.appendChild(tagName); // Append the title to the overlay

  // Add the overlay to the document
  document.body.appendChild(overlay);
});

document.addEventListener("mouseout", function () {
  console.log("mouseout");
  var existingOverlay = document.getElementById("hoverOverlay");
  if (existingOverlay) existingOverlay.remove();
});
