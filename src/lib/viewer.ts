import { ViewerMessage } from "@/types/Viewer";
import html2canvas from "html2canvas";
import { getProjectUrl } from "./utils";

export async function htmlStringToPng(html: string) {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = html;
  iframe.width = `${330}px`;
  iframe.height = `${620}px`;

  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";

  // Append the iframe to the body (it needs to be in the document to render)
  document.body.appendChild(iframe);

  // Wait for the iframe to load its content
  await new Promise((resolve) => {
    iframe.onload = resolve;
  });

  const screenshotCanvas = await html2canvas(iframe, {
    width: parseFloat(iframe.width),
    height: parseFloat(iframe.height)
  });
  const screenshotDataUrl = screenshotCanvas.toDataURL("image/png");

  // Remove the iframe after taking the screenshot
  document.body.removeChild(iframe);

  return screenshotDataUrl;
}

export function receiveViewerMessage(
  event: MessageEvent<ViewerMessage>,
  onMessage: (event: MessageEvent<ViewerMessage>["data"]) => void,
) {
  if (event.origin !== getProjectUrl()) {
    throw new Error("Invalid origin");
  }

  onMessage(event.data);
}

export function sendViewerMessage(
  viewer: HTMLIFrameElement | null,
  message: ViewerMessage,
) {
  const projectUrl = getProjectUrl();
  if (!projectUrl) {
    throw new Error("Project URL is not defined");
  }
  if (!viewer) {
    throw new Error("Viewer is not defined");
  }
  viewer.contentWindow?.postMessage(message, projectUrl);
}
