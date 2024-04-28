import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let timeout: NodeJS.Timeout | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => ReturnType<F> {
  return function executedFunction(
    ...args: Parameters<F>
  ): ReturnType<F> | void {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as ReturnType<F>;
}
