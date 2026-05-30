import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prepends basePath to public asset URLs (needed for GitHub Pages) */
export function assetUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
