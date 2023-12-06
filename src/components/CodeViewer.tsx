import { useEffect } from "react";

interface IFrameProps {
  html: string;
}

const IFrame: React.FC<IFrameProps> = ({ html }) => {
  useEffect(() => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.srcdoc = `<!DOCTYPE html>
                <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body>${html}</body>
                </html>`;
    }
  }, [html]);

  return (
    <iframe
      title="Rendered Output"
      className="w-full h-full"
      srcDoc={`<!DOCTYPE html>
                <html>
                    <head>
                        <link
                            href="https://cdn.tailwindcss.com/2.2.19/tailwind.min.css"
                            rel="stylesheet"
                        />

                    </head>
                    <body></body>
                </html>`}
    />
  );
};

export default IFrame;
