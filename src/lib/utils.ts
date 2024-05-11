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
  identifier: "UPDATE_CODE",
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
