var showOverlay = false;

document.addEventListener("mouseover", function (event) {
  if (!showOverlay) return;

  var target = event.target;
  const name = target.tagName;

  // Get the bounding rectangle of target
  var rect = target.getBoundingClientRect();

  // Get computed style of target
  var style = window.getComputedStyle(target);

  var existingOverlay = document.getElementById("hoverOverlay");
  var existingMarginOverlay = document.getElementById("hoverMarginOverlay");
  if (existingOverlay) existingOverlay.remove();
  if (existingMarginOverlay) existingMarginOverlay.remove();

  // Calculate margins
  const marginTop = parseInt(style.marginTop);
  const marginBottom = parseInt(style.marginBottom);
  const marginLeft = parseInt(style.marginLeft);
  const marginRight = parseInt(style.marginRight);

  // Create a new overlay for the margin
  const marginOverlay = document.createElement("div");
  marginOverlay.id = "hoverMarginOverlay";
  marginOverlay.style.position = "fixed";
  marginOverlay.style.left = rect.left - marginLeft + "px";
  marginOverlay.style.top = rect.top - marginTop + "px";
  marginOverlay.style.width = rect.width + marginLeft + marginRight + "px";
  marginOverlay.style.height = rect.height + marginTop + marginBottom + "px";
  marginOverlay.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Orange with opacity
  marginOverlay.style.pointerEvents = "none";

  // Create a new overlay for the element (excluding margin)
  const overlay = document.createElement("div");
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
  const tagNameOverlay = document.createElement("div");
  tagNameOverlay.innerText = name;
  tagNameOverlay.style.position = "absolute";
  tagNameOverlay.style.top = "0";
  tagNameOverlay.style.left = "0";
  tagNameOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  tagNameOverlay.style.color = "white";
  tagNameOverlay.style.padding = "4px";

  overlay.appendChild(tagNameOverlay);

  document.body.appendChild(marginOverlay);
  document.body.appendChild(overlay);
});

document.addEventListener("mouseout", function () {
  if (!showOverlay) return;

  var existingOverlay = document.getElementById("hoverOverlay");
  var existingMarginOverlay = document.getElementById("hoverMarginOverlay");
  if (existingOverlay) existingOverlay.remove();
  if (existingMarginOverlay) existingMarginOverlay.remove();
});

document.addEventListener("click", function (event) {
  if (!showOverlay) return;

  var target = event.target;
  const id = target.getAttribute("visual-tw-id");

  window.parent.postMessage(
    {
      type: "viewer-element-selected",
      data: {
        uuid: id,
      },
    },
    "*",
  );
});

window.addEventListener("message", function (event) {
  if (event.data.type === "viewer-set-overlay-show") {
    showOverlay = event.data.data.newValue;
  }
});
