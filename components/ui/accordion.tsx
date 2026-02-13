"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
}>({});

const Accordion = ({
    children,
    className,
    type = "single",
    collapsible = true,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    type?: "single" | "multiple";
    collapsible?: boolean;
}) => {
    const [value, setValue] = React.useState<string | undefined>(undefined);

    const onValueChange = (newValue: string) => {
        if (collapsible && value === newValue) {
            setValue(undefined);
        } else {
            setValue(newValue);
        }
    };

    return (
        <AccordionContext.Provider value={{ value, onValueChange }}>
            <div className={cn("space-y-2", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("border-b", className)}
        data-value={value}
        {...props}
    />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(AccordionContext);
    // Find the parent item value
    // This is a simplification; in a real Radix port we'd use context for item value too.
    // Ideally we need to wrap AccordionItem in a context.

    // Let's rely on the user passing `onClick` or handling it via the item value context if we refactor.
    // For now, let's look at how I used it in FAQ.tsx: `<AccordionItem value="...">`.
    // I need to know the Item's value here.

    // Correct approach for a custom component without Radix:
    // We need an ItemContext.
    return (
        <AccordionItemContext.Consumer>
            {({ value: itemValue }) => (
                <button
                    ref={ref}
                    onClick={() => onValueChange?.(itemValue)}
                    className={cn(
                        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                        className
                    )}
                    {...props}
                >
                    {children}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </button>
            )}
        </AccordionItemContext.Consumer>
    );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(AccordionContext);

    return (
        <AccordionItemContext.Consumer>
            {({ value: itemValue }) => {
                const isOpen = selectedValue === itemValue;
                return (
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div
                                    ref={ref}
                                    className={cn("pb-4 pt-0", className)}
                                    {...props}
                                >
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                );
            }}
        </AccordionItemContext.Consumer>
    );
});
AccordionContent.displayName = "AccordionContent";

// Helper Context for Item
const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

// Wrap Item to provide context
const AccordionItemWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
    <AccordionItemContext.Provider value={{ value }}>
        <div
            ref={ref}
            className={cn("border-b", className)}
            {...props}
        >
            {children}
        </div>
    </AccordionItemContext.Provider>
));
AccordionItemWrapper.displayName = "AccordionItem";

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent };
