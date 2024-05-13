import { useEffect, useState } from "react";

export default function useCheckScreenDimensions() {
  const [isError, setIsError] = useState(
    window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsError(
        window.innerWidth < 768,
      );
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isError;
}
