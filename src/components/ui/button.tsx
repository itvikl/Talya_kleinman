import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans uppercase tracking-editorial text-xs transition-all duration-500 ease-editorial disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'border border-ink bg-ink text-cream-100 px-8 py-3.5 hover:bg-brass hover:border-brass',
        outline:
          'border border-ink/40 text-ink px-8 py-3.5 hover:border-brass hover:text-brass',
        ghost: 'text-ink px-2 py-1 hover:text-brass',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
