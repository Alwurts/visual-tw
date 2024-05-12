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
