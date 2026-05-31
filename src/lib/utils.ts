import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns public asset URL (no basePath needed on Vercel) */
export function assetUrl(path: string): string {
  return path;
}
