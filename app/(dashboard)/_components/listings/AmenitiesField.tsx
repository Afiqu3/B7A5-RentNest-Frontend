"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Wi-Fi",
  "24/7 Security",
  "Lift",
  "Generator Backup",
  "Parking",
  "Balcony",
  "Furnished",
  "Gas Line",
];

const MAX_AMENITIES = 20;

type AmenitiesFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
  disabled?: boolean;
};

/**
 * A chip editor for the amenities list. The parent serialises `value` into a
 * comma-joined hidden input, which is what the server action parses back out.
 */
const AmenitiesField = ({
  value,
  onChange,
  invalid,
  disabled,
}: AmenitiesFieldProps) => {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const amenity = raw.trim().replace(/,+$/, "");
    if (!amenity) return;

    const exists = value.some(
      (item) => item.toLowerCase() === amenity.toLowerCase(),
    );
    if (exists || value.length >= MAX_AMENITIES) {
      setDraft("");
      return;
    }

    onChange([...value, amenity]);
    setDraft("");
  };

  const remove = (amenity: string) => {
    onChange(value.filter((item) => item !== amenity));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter and comma both commit; the form must not submit mid-entry.
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value[value.length - 1]);
    }
  };

  const unusedSuggestions = SUGGESTIONS.filter(
    (suggestion) =>
      !value.some((item) => item.toLowerCase() === suggestion.toLowerCase()),
  ).slice(0, 5);

  return (
    <div className="space-y-2.5">
      <div
        className={cn(
          "rounded-3xl border border-input bg-input/30 p-2.5 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          invalid && "border-destructive ring-[3px] ring-destructive/20",
        )}
      >
        <AnimatePresence initial={false}>
          {value.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-1.5 overflow-hidden pb-2"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {value.map((amenity) => (
                  <motion.span
                    key={amenity}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pr-1 pl-3 text-xs font-medium text-primary"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => remove(amenity)}
                      disabled={disabled}
                      aria-label={`Remove ${amenity}`}
                      className="rounded-full p-0.5 text-primary/70 transition-colors hover:bg-primary/15 hover:text-primary disabled:opacity-50"
                    >
                      <X className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => add(draft)}
            disabled={disabled || value.length >= MAX_AMENITIES}
            placeholder={
              value.length >= MAX_AMENITIES
                ? "Amenity limit reached"
                : "Type an amenity and press Enter"
            }
            className="h-8 border-0 bg-transparent px-1.5 focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => add(draft)}
            disabled={disabled || !draft.trim()}
            aria-label="Add amenity"
          >
            <Plus />
          </Button>
        </div>
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          {unusedSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => add(suggestion)}
              disabled={disabled}
              className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmenitiesField;
