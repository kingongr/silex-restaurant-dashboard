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
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {allowCustom && searchValue.trim() && (
                <>
                  <CommandItem
                    value="custom"
                    onSelect={handleSelect}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {customText}: "{searchValue}"
                  </CommandItem>
                  <CommandItem
                    value="use-custom"
                    onSelect={handleCustomUse}
                    className="text-green-600 dark:text-green-400 font-medium"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Use "{searchValue}"
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
