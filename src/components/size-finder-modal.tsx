"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getShoeSize,
  getApparelSize,
  isShoeProduct,
  APPAREL_SIZE_LABELS,
  type GenderCategory,
} from "@/lib/size-finder";

interface SizeFinderModalProps {
  open: boolean;
  onClose: () => void;
  sizes: number[];
  gender: GenderCategory;
  onSelectSize: (size: number) => void;
}

function InputField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-[0.5px] text-charcoal">
        {label}
      </label>
      <div className="flex items-center border border-border rounded-sm overflow-hidden focus-within:border-charcoal transition-colors">
        <input
          type="number"
          min={0}
          step={0.1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className="flex-1 px-3 py-2.5 text-[13px] text-charcoal outline-none bg-white"
        />
        <span className="px-3 text-[12px] text-warm-gray bg-white">cm</span>
      </div>
    </div>
  );
}

export function SizeFinderModal({
  open,
  onClose,
  sizes,
  gender,
  onSelectSize,
}: SizeFinderModalProps) {
  const isShoes = isShoeProduct(sizes);

  const [foot, setFoot] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");

  const [suggested, setSuggested] = useState<number | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  function handleCalculate() {
    setNoMatch(false);
    setSuggested(null);

    let rawSize: number | null = null;

    if (isShoes) {
      const g = gender === "women" ? "women" : "men";
      rawSize = getShoeSize(parseFloat(foot), g);
    } else {
      rawSize = getApparelSize(
        {
          chest: parseFloat(chest),
          waist: parseFloat(waist),
          hips: parseFloat(hips),
        },
        gender
      );
    }

    if (rawSize === null) return;

    const available = sizes.includes(rawSize)
      ? rawSize
      : sizes.reduce((prev, curr) =>
          Math.abs(curr - rawSize!) < Math.abs(prev - rawSize!) ? curr : prev
        );

    if (Math.abs(available - rawSize) > 2) {
      setNoMatch(true);
    } else {
      setSuggested(available);
    }
  }

  function handleConfirm() {
    if (suggested === null) return;
    onSelectSize(suggested);
    onClose();
  }

  function handleReset() {
    setFoot("");
    setChest("");
    setWaist("");
    setHips("");
    setSuggested(null);
    setNoMatch(false);
  }

  if (!open) return null;

  const sizeLabel = (s: number) =>
    isShoes ? `US ${s}` : `${APPAREL_SIZE_LABELS[s] ?? s}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-xl shadow-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.6px] text-charcoal">
            Find Your Size
          </h2>
          <button
            onClick={onClose}
            className="text-warm-gray hover:text-charcoal transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        {isShoes ? (
          <InputField
            label="Foot Length"
            hint="e.g. 26.5"
            value={foot}
            onChange={setFoot}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <InputField
              label="Chest Circumference"
              hint="e.g. 96"
              value={chest}
              onChange={setChest}
            />
            <InputField
              label="Waist Circumference"
              hint="e.g. 80"
              value={waist}
              onChange={setWaist}
            />
            <InputField
              label="Hip Circumference"
              hint="e.g. 102"
              value={hips}
              onChange={setHips}
            />
          </div>
        )}

        {/* Calculate button */}
        {suggested === null && !noMatch && (
          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.6px] rounded-full hover:bg-charcoal/80 transition-colors"
          >
            Find My Size
          </button>
        )}

        {/* No match */}
        {noMatch && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-warm-gray text-center">
              No perfect match in available sizes.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-3 border border-border text-charcoal text-[12px] font-medium uppercase tracking-[0.6px] rounded-full hover:border-charcoal transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Suggestion */}
        {suggested !== null && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1 py-3 border border-border rounded-sm">
              <span className="text-[11px] uppercase tracking-[0.5px] text-warm-gray">
                Recommended Size
              </span>
              <span className="text-2xl font-medium text-charcoal">
                {sizeLabel(suggested)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSuggested(s)}
                  className={cn(
                    "py-2.5 text-[13px] font-medium rounded-sm transition-all border",
                    suggested === s
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-white border-border text-charcoal hover:border-charcoal"
                  )}
                >
                  {sizeLabel(s)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 border border-border text-charcoal text-[12px] font-medium uppercase tracking-[0.6px] rounded-full hover:border-charcoal transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.6px] rounded-full hover:bg-charcoal/80 transition-colors"
              >
                Select {sizeLabel(suggested)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
