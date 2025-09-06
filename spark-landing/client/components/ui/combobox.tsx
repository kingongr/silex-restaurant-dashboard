import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

/**
 * Helper function to build className string for combobox button
 * @param value - Current selected value
 * @param open - Whether the combobox is open
 * @param className - Additional className to append
 * @returns Computed className string
 */
function getComboboxButtonClasses(value: string, open: boolean, className?: string): string {
  return cn(
    "w-full h-12 justify-between bg-white/80 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200",
    !value && "text-gray-500 dark:text-gray-400",
    value && "text-gray-900 dark:text-white",
    open && "border-blue-500 ring-2 ring-blue-500/20",
    className
  );
}

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allowCustom?: boolean;
  customText?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  allowCustom = true,
  customText = "Use custom value",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "custom") {
      // Use the search value as custom input
      onValueChange(searchValue);
    } else {
      onValueChange(selectedValue);
    }
    setOpen(false);
    setSearchValue("");
  };

  const handleCustomUse = () => {
    if (searchValue.trim()) {
      onValueChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={getComboboxButtonClasses(value, open, className)}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className={cn(
            "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl" align="start">
        <Command className="rounded-xl">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-12 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {emptyText}
            </CommandEmpty>
            <CommandGroup className="p-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/20",
                    value === option.value && "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-3 h-4 w-4 transition-opacity duration-200",
                      value === option.value ? "opacity-100 text-blue-600 dark:text-blue-400" : "opacity-0"
                    )}
                  />
                  <span className={cn(
                    "font-medium",
                    value === option.value ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {option.label}
                  </span>
                </CommandItem>
              ))}
              {allowCustom && searchValue.trim() && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <CommandItem
                    value="custom"
                    onSelect={handleSelect}
                    className="flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                  >
                    <Plus className="mr-3 h-4 w-4" />
                    <span className="font-medium">{customText}: <span className="font-bold">"{searchValue}"</span></span>
                  </CommandItem>
                  <CommandItem
                    value="use-custom"
                    onSelect={handleCustomUse}
                    className="flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-950/20 text-green-600 dark:text-green-400 font-semibold"
                  >
                    <Check className="mr-3 h-4 w-4" />
                    <span>Use <span className="font-bold">"{searchValue}"</span></span>
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
