import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";

const DashboardDialog = DialogPrimitive.Root;
const DashboardDialogTrigger = DialogPrimitive.Trigger;
const DashboardDialogPortal = DialogPrimitive.Portal;
const DashboardDialogClose = DialogPrimitive.Close;

const DashboardDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    style={{ zIndex: Z_INDEX.BACKDROP }}
    {...props}
  />
));
DashboardDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DashboardDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DashboardDialogPortal>
    <DashboardDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        "fixed grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-20 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-20",
        // Positioning - Mobile: centered with top offset
        "left-1/2 top-20 -translate-x-1/2",
        // Desktop positioning with sidebar consideration
        "md:translate-x-0 md:left-[280px] md:top-20",
        // Collapsed sidebar adjustment
        "[.sidebar-collapsed_&]:md:left-[80px]",
        className,
      )}
      style={{ zIndex: Z_INDEX.DASHBOARD_MODAL }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DashboardDialogPortal>
));
DashboardDialogContent.displayName = DialogPrimitive.Content.displayName;

const DashboardDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DashboardDialogHeader.displayName = "DashboardDialogHeader";

const DashboardDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DashboardDialogFooter.displayName = "DashboardDialogFooter";

const DashboardDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DashboardDialogTitle.displayName = DialogPrimitive.Title.displayName;

const DashboardDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DashboardDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  DashboardDialog,
  DashboardDialogTrigger,
  DashboardDialogPortal,
  DashboardDialogOverlay,
  DashboardDialogClose,
  DashboardDialogContent,
  DashboardDialogHeader,
  DashboardDialogFooter,
  DashboardDialogTitle,
  DashboardDialogDescription,
};
