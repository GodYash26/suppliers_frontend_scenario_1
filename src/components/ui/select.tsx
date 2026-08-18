"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return props.children ? extractText(props.children) : '';
  }
  return '';
}

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, string>>({});
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const registerLabel = React.useCallback((val: string, label: string) => {
    setLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, triggerRef, labels, registerLabel }}
    >
      <div className="relative inline-block text-left w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  const { open, setOpen, triggerRef } = context;

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 ml-2 transition-transform", open && "rotate-180")} />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  const { value, labels } = context;

  return (
    <span className="block truncate text-left">
      {value !== undefined && labels[value] ? labels[value] : placeholder}
    </span>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  const { open, triggerRef, setOpen } = context;

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute right-0 z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-gray-200 bg-white p-1 text-sm text-gray-900 shadow-md focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({
  className,
  value,
  children,
  ...props
}: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  const { value: selectedValue, onValueChange, setOpen, registerLabel } = context;

  const isSelected = selectedValue === value;
  const label = extractText(children);

  React.useEffect(() => {
    registerLabel(value, label);
  }, [value, label, registerLabel]);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onMouseDown={(e) => {
        e.preventDefault();
        onValueChange?.(value);
        setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-gray-900 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      <span className="block truncate">{children}</span>
    </div>
  );
}
