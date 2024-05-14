var showOverlay = false;
const overlayTracker = new Set();

function triggerOverlay(event) {
  if (!showOverlay) return;

  const target = event.target;

  clearOverlays(); // Remove existing overlays if they exist

  const marginRect = calculateBox(target, "margin");
  const borderRect = calculateBox(target, "border");
  const paddingRect = calculateBox(target, "padding");
  const contentRect = calculateBox(target, "content");

  const marginRects = boxClipPath(marginRect, borderRect);
  const borderRects = boxClipPath(borderRect, paddingRect);
  const paddingRects = boxClipPath(paddingRect, contentRect);
  const contentRects = [contentRect];

  createOverlay(marginRects, {
    backgroundColor: "rgba(255, 199, 0, 0.4)", // lighter opacity for margins
    zIndex: 2,
  });

  createOverlay(borderRects, {
    backgroundColor: "rgba(0, 255, 0, 0.4)", // lighter opacity for borders
    zIndex: 3,
  });

  createOverlay(paddingRects, {
    backgroundColor: "rgba(35, 175, 0, 0.4)", // lighter opacity for padding
    zIndex: 4,
  });

  createOverlay(contentRects, {
    backgroundColor: "rgba(0, 136, 207, 0.4)", // lighter opacity for content
    zIndex: 5,
  });

  addLabel(target.tagName, borderRect);
}

function calculateBox(element, type) {
  const boundingRect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  switch (type) {
    case "margin": {
      return new DOMRect(
        boundingRect.left - parseFloat(style.marginLeft),
        boundingRect.top - parseFloat(style.marginTop),
        boundingRect.width +
          parseFloat(style.marginLeft) +
          parseFloat(style.marginRight),
        boundingRect.height +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom),
      );
    }
    case "padding": {
      return new DOMRect(
        boundingRect.left + parseFloat(style.borderLeftWidth),
        boundingRect.top + parseFloat(style.borderTopWidth),
        boundingRect.width -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth),
        boundingRect.height -
          parseFloat(style.borderTopWidth) -
          parseFloat(style.borderBottomWidth),
      );
    }
    case "content": {
      return new DOMRect(
        boundingRect.left +
          parseFloat(style.borderLeftWidth) +
          parseFloat(style.paddingLeft),
        boundingRect.top +
          parseFloat(style.borderTopWidth) +
          parseFloat(style.paddingTop),
        boundingRect.width -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth) -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight),
        boundingRect.height -
          parseFloat(style.borderTopWidth) -
          parseFloat(style.borderBottomWidth) -
          parseFloat(style.paddingTop) -
          parseFloat(style.paddingBottom),
      );
    }
    case "border":
    default:
      return boundingRect;
  }
}

/**
 * Clip a box with a given clip box
 * @param {DOMRect} parentBox - The box to clip
 * @param {DOMRect} clipBox - The box to clip with
 */
function boxClipPath(parentBox, clipBox) {
  let boxLeft = new DOMRect(
    parentBox.left,
    parentBox.top,
    clipBox.left - parentBox.left,
    parentBox.height,
  );

  let boxTop = new DOMRect(
    clipBox.left,
    parentBox.top,
    clipBox.width,
    clipBox.top - parentBox.top,
  );

  let boxRight = new DOMRect(
    clipBox.right,
    parentBox.top,
    parentBox.right - clipBox.right,
    parentBox.height,
  );

  let boxBottom = new DOMRect(
    clipBox.left,
    clipBox.bottom,
    clipBox.width,
    parentBox.bottom - clipBox.bottom,
  );

  return [boxLeft, boxTop, boxRight, boxBottom];
}

/**
 * Create an overlay on the page
 * @param {DOMRect[]} domRects - The id of
 * @param {object} overlayStyle - The style of the overlay
 */
function createOverlay(domRects, overlayStyle) {
  const { backgroundColor, zIndex } = overlayStyle;

  domRects.forEach((rect) => {
    const mainOverlay = document.createElement("div");
    mainOverlay.style.position = "fixed";
    mainOverlay.style.left = `${rect.left}px`;
    mainOverlay.style.top = `${rect.top}px`;
    mainOverlay.style.width = `${rect.width}px`;
    mainOverlay.style.height = `${rect.height}px`;
    mainOverlay.style.pointerEvents = "none";
    mainOverlay.style.backgroundColor = backgroundColor || "transparent";
    mainOverlay.style.zIndex = "99" + zIndex;

    overlayTracker.add(mainOverlay);

    document.body.appendChild(mainOverlay);
  });
}

function addLabel(text, { left, top }) {
  const label = document.createElement("div");
  label.id = "hoverLabel";
  label.style.zIndex = "9999";
  label.innerText = text;
  label.style.position = "fixed";
  label.style.top = `${top}px`;
  label.style.left = `${left}px`;
  label.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  label.style.color = "white";
  label.style.padding = "4px";

  overlayTracker.add(label);

  document.body.appendChild(label);
}

function handleMouseOut() {
  if (!showOverlay) return;
  clearOverlays();
}

function clearOverlays() {
  overlayTracker.forEach((element) => element.remove());
}

document.addEventListener("click", function (event) {
  if (!showOverlay) return;

  const target = event.target;
  const id = target.getAttribute("visual-tw-id");

  const rect = target.getBoundingClientRect();

  window.parent.postMessage(
    {
      type: "viewer-element-selected",
      data: {
        uuid: id,
        boundingClientRect: rect,
      },
    },
    window.parent.location.origin,
  );
});

document.addEventListener("mouseover", triggerOverlay);
document.addEventListener("mouseout", handleMouseOut);

window.addEventListener("message", function (event) {
  if (event.data.type === "viewer-set-overlay-show") {
    showOverlay = event.data.data.newValue;
  }
  if (event.data.type === "viewer-settings-response") {
    showOverlay = event.data.data.showOverlay;
  }
});

window.addEventListener("load", function () {
  window.parent.postMessage(
    {
      type: "viewer-settings-request",
    },
    window.parent.location.origin,
  );
});
