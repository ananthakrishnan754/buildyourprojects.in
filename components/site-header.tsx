"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    dialogRef.current?.showModal();
    document.documentElement.classList.add("sheet-open");
    setOpen(true);
  };

  const closeMenu = () => {
    dialogRef.current?.close();
  };

  const handleClose = () => {
    document.documentElement.classList.remove("sheet-open");
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href.startsWith("/#") || item.href.includes("#")
                ? false
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-sm px-3 text-[14px] font-medium transition-colors duration-[var(--dur-micro)] hover:bg-elevated hover:text-text ${
                  active ? "text-text" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="btn btn-secondary btn-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={openMenu}
        >
          <span className="sr-only">Open menu</span>
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        className="mobile-sheet"
        aria-label="Site menu"
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between">
            <BrandMark />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={closeMenu}
            >
              <span className="sr-only">Close menu</span>
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-md px-3 text-lg font-medium text-text hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-stroke pt-5">
            <Link
              href="/products/submission-kit"
              onClick={closeMenu}
              className="btn btn-primary w-full"
            >
              Get the Submission Kit · ₹499
            </Link>
            <p className="mt-3 type-body-sm text-muted">
              Checkout opens after the payments phase. Browse the packs now.
            </p>
          </div>
        </div>
      </dialog>
    </header>
  );
}
