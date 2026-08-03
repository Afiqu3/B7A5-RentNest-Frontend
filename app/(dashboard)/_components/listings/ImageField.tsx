"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadPropertyImage } from "../../_actions/uploadActions";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

type ImageFieldProps = {
  value: string;
  onChange: (url: string) => void;
  invalid?: boolean;
  disabled?: boolean;
};

/**
 * Uploads the chosen file to Cloudinary through a Server Action and hands the
 * resulting secure URL back to the form. The URL — never the file — is what
 * gets submitted with the listing.
 */
const ImageField = ({
  value,
  onChange,
  invalid,
  disabled,
}: ImageFieldProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const upload = React.useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error("That image is larger than 5MB. Try a smaller one.");
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadPropertyImage(formData);

        if (result.success && result.url) {
          onChange(result.url);
          toast.success("Photo uploaded.");
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("We couldn't upload that photo. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
  };

  const busy = disabled || uploading;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          // Reset so re-picking the same file still fires a change event.
          event.target.value = "";
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="group relative h-44 overflow-hidden rounded-3xl border border-border/70 bg-muted sm:h-52"
          >
            <Image
              src={value}
              alt="Property photo preview"
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-end gap-2 p-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={busy}
                onClick={() => onChange("")}
              >
                <Trash2 />
                Remove
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              if (!busy) handleFiles(event.dataTransfer.files);
            }}
          >
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex h-44 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-input/20 px-4 text-center transition-colors sm:h-52",
                "hover:border-primary/50 hover:bg-primary/5",
                dragging && "border-primary bg-primary/10",
                invalid && "border-destructive/60 bg-destructive/5",
                busy && "pointer-events-none opacity-70",
              )}
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : dragging ? (
                  <UploadCloud className="size-5" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </span>
              <span className="text-sm font-medium text-foreground">
                {uploading ? "Uploading to Cloudinary…" : "Upload a photo"}
              </span>
              <span className="text-xs text-muted-foreground">
                Drag and drop, or click to browse — JPG, PNG, WebP up to 5MB
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageField;
