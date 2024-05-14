import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const timeouts: Map<string, NodeJS.Timeout> = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  identifier: "UPDATE_CODE" | "UPDATE_NODE_TEXT",
): (...args: Parameters<F>) => void {
  return function executedFunction(...args: Parameters<F>): void {
    if (timeouts.has(identifier)) {
      clearTimeout(timeouts.get(identifier)!);
    }
    const timeout = setTimeout(() => {
      func(...args);
      timeouts.delete(identifier);
    }, wait);
    timeouts.set(identifier, timeout);
  };
}

export function getProjectUrl(): string | undefined {
  let url = import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL
    : undefined;

  if (import.meta.env.VITE_VERCEL_ENV === undefined) {
    url = import.meta.env.VITE_LOCAL_PROJECT_URL;
  }

  return url;
}
