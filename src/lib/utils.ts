import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
