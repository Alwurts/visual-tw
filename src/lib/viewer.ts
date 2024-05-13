import { ViewerMessage } from "@/types/Viewer";
import html2canvas from "html2canvas";

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

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDocument) {
    throw new Error("Failed to get iframe document");
  }

  const screenshotCanvas = await html2canvas(iframeDocument.body);
  const screenshotDataUrl = screenshotCanvas.toDataURL("image/png");

  return screenshotDataUrl;
}

export function receiveViewerMessage(
  event: MessageEvent<ViewerMessage>,
  onMessage: (event: MessageEvent<ViewerMessage>["data"]) => void,
) {
  let url = import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL
    : undefined;

  if (import.meta.env.VITE_VERCEL_ENV === undefined) {
    url = import.meta.env.VITE_LOCAL_PROJECT_URL;
  }

  if (event.origin !== url) {
    throw new Error("Invalid origin");
  }

  onMessage(event.data);
}
