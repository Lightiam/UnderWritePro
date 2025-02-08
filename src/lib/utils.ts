import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const APP_NAME = "Lendify AI"
export const APP_DESCRIPTION = "AI-Powered Credit Scoring Platform"
