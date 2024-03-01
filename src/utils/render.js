document.addEventListener("mouseover", function (event) {
  var target = event.target;
  var id = target.getAttribute("re-id");
  if (id) {
    console.log(target);

    var existingOverlay = document.getElementById("hoverOverlay");
    if (existingOverlay) existingOverlay.remove();

    // Create a new overlay
    var overlay = document.createElement("div");
    overlay.id = "hoverOverlay";
    overlay.style.position = "absolute";
    overlay.style.left = target.offsetLeft + "px";
    overlay.style.top = target.offsetTop + "px";
    overlay.style.width = target.offsetWidth + "px";
    overlay.style.height = target.offsetHeight + "px";
    overlay.style.backgroundColor = "rgba(0, 50, 150, 0.5)"; // Semi-transparent black
    overlay.style.pointerEvents = "none"; // Add this line

    // Add the overlay to the document
    document.body.appendChild(overlay);
  }
});

document.addEventListener("mouseout", function () {
    console.log("mouseout");
  var existingOverlay = document.getElementById("hoverOverlay");
  if (existingOverlay) existingOverlay.remove();
});
