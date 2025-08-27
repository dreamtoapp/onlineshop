import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { cva } from 'class-variance-authority'; // Import cva

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get dynamic company logo from database with fallback
export async function getCompanyLogo(): Promise<string> {
  try {
    // Dynamic import to avoid server/client boundary issues
    const { companyInfo } = await import('@/app/(e-comm)/actions/companyDetail');
    const company = await companyInfo();

    // Return company logo if available, otherwise fallback to static logo
    return company?.logo || '/fallback/dreamToApp2-dark.png';
  } catch (error) {
    console.warn('Failed to fetch company logo, using fallback:', error);
    return '/fallback/dreamToApp2-dark.png';
  }
}

// Icon CVA Variants (moved from components/icons/index.tsx)
export const iconVariants = cva('inline-block shrink-0', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
    size: {
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    },
    animation: {
      none: '',
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      ping: 'animate-ping',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    animation: 'none',
  },
});

/**
 * يتحقق إذا كان النص معرف ObjectId صالح (24 محرفًا هكساديسيمال)
 */

/**
 * Creates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Generates a unique slug by appending a counter if needed
 * @param baseSlug The initial slug to use
 * @param existingSlugs Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
