"use client";

interface PriceDisplayProps {
  pricePerNight?: number | null;
  discountPercentage?: number | null;
  discountLabel?: string | null;
  priceText?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  pricePerNight,
  discountPercentage = 0,
  discountLabel,
  priceText,
  size = "md",
  className = "",
}: PriceDisplayProps) {
  const discount = discountPercentage || 0;
  const hasDiscount = discount > 0 && pricePerNight;
  const discountedPrice = pricePerNight
    ? Math.round(pricePerNight * (1 - discount / 100))
    : null;

  const sizeClasses = {
    sm: {
      original: "text-sm",
      price: "text-lg",
      badge: "text-[10px] px-1.5 py-0.5",
      perNight: "text-xs",
    },
    md: {
      original: "text-base",
      price: "text-2xl",
      badge: "text-xs px-2 py-0.5",
      perNight: "text-sm",
    },
    lg: {
      original: "text-lg",
      price: "text-3xl",
      badge: "text-sm px-2.5 py-1",
      perNight: "text-base",
    },
  };

  const s = sizeClasses[size];

  // No numeric price set — fallback to text
  if (!pricePerNight) {
    return (
      <p className={`${s.price} font-serif font-semibold text-foreground ${className}`}>
        {priceText || "Contact for rates"}
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-baseline gap-2 flex-wrap">
        {hasDiscount && (
          <span className={`${s.original} line-through text-muted-foreground/60 font-medium`}>
            ${pricePerNight}
          </span>
        )}
        <span className={`${s.price} font-serif font-semibold text-foreground`}>
          ${hasDiscount ? discountedPrice : pricePerNight}
        </span>
        <span className={`${s.perNight} text-muted-foreground`}>/night</span>
      </div>
      {hasDiscount && (
        <span className={`${s.badge} rounded-full bg-accent/15 text-accent font-semibold w-fit`}>
          {discount}% OFF{discountLabel ? ` — ${discountLabel}` : ""}
        </span>
      )}
    </div>
  );
}
