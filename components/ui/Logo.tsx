import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Link2 } from 'lucide-react';

interface LogoProps {
    variant?: 'full' | 'icon';
    className?: string;
}

export const Logo = ({ variant = 'full', className }: LogoProps) => {
    // If we had a specific icon file, we'd use it here.
    // Since we only have logo.png, we'll use it for 'full'.
    // For 'icon', we'll fallback to the default styling if no icon image exists,
    // or you can upload 'logo-icon.png' later.

    if (variant === 'icon') {
        return (
            <div className={cn("relative h-16 w-16 flex items-center justify-center", className)}>
                <Image
                    src="/logo-icon.svg"
                    alt="Logo Icon"
                    width={64}
                    height={64}
                    className="object-contain"
                />
            </div>
        );
    }

    return (
        <div className={cn("relative h-10 w-auto aspect-[5/1] flex items-center", className)}>
            <Image
                src="/logo.svg"
                alt="PayForLink Logo"
                fill
                className="object-contain object-left"
                priority
            />
        </div>
    );
};
