document.addEventListener("mouseover", function (event) {
  var target = event.target;
  const id = target.getAttribute("visual-tw-id");

  // Get the bounding rectangle of target
  var rect = target.getBoundingClientRect();

  // Get computed style of target
  var style = window.getComputedStyle(target);

  var existingOverlay = document.getElementById("hoverOverlay");
  var existingMarginOverlay = document.getElementById("hoverMarginOverlay");
  if (existingOverlay) existingOverlay.remove();
  if (existingMarginOverlay) existingMarginOverlay.remove();

  // Calculate margins
  var marginTop = parseInt(style.marginTop);
  var marginBottom = parseInt(style.marginBottom);
  var marginLeft = parseInt(style.marginLeft);
  var marginRight = parseInt(style.marginRight);

  // Create a new overlay for the margin
  var marginOverlay = document.createElement("div");
  marginOverlay.id = "hoverMarginOverlay";
  marginOverlay.style.position = "fixed";
  marginOverlay.style.left = rect.left - marginLeft + "px";
  marginOverlay.style.top = rect.top - marginTop + "px";
  marginOverlay.style.width = rect.width + marginLeft + marginRight + "px";
  marginOverlay.style.height = rect.height + marginTop + marginBottom + "px";
  marginOverlay.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Orange with opacity
  marginOverlay.style.pointerEvents = "none";

  // Create a new overlay for the element (excluding margin)
  var overlay = document.createElement("div");
  overlay.id = "hoverOverlay";
  overlay.style.position = "fixed";
  overlay.style.left = rect.left + "px";
  overlay.style.top = rect.top + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
  overlay.style.border = "2px solid rgba(0, 50, 150, 0.5)";
  overlay.style.backgroundColor = "rgba(0, 100, 255, 0.5)";
  overlay.style.pointerEvents = "none";

  // Add the title to the overlay
  var tagName = document.createElement("div");
  tagName.innerText = target.tagName;
  tagName.style.position = "absolute";
  tagName.style.top = "0";
  tagName.style.left = "0";
  tagName.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  tagName.style.color = "white";
  tagName.style.padding = "4px";

  overlay.appendChild(tagName);

  // Add the overlays to the document
  document.body.appendChild(marginOverlay);
  document.body.appendChild(overlay);

  window.parent.postMessage(
    {
      type: "elementhovered",
      target: {
        tagName: target.tagName,
        id,
      },
    },
    "*",
  );
});

document.addEventListener("mouseout", function () {
  var existingOverlay = document.getElementById("hoverOverlay");
  var existingMarginOverlay = document.getElementById("hoverMarginOverlay");
  if (existingOverlay) existingOverlay.remove();
  if (existingMarginOverlay) existingMarginOverlay.remove();
});
