import { useId } from "react";

type IconProps = { size?: number; className?: string };

function Svg({ size, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={["xp-icon", className].filter(Boolean).join(" ")}
    >
      {children}
    </svg>
  );
}

export function FolderIcon({ size = 16, className }: IconProps) {
  const id = useId();

  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2b3" />
          <stop offset="1" stopColor="#f2c45a" />
        </linearGradient>

        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe48a" />
          <stop offset="1" stopColor="#e9a93a" />
        </linearGradient>
      </defs>

      <path
        d="M2.5 7.5a2 2 0 0 1 2-2h7l2.5 3h13.5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2h-23a2 2 0 0 1-2-2z"
        fill={`url(#${id}b)`}
        stroke="#c08a1e"
      />

      <path
        d="M2.5 13.5a2 2 0 0 1 2-2h23a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-23a2 2 0 0 1-2-2z"
        fill={`url(#${id}f)`}
        stroke="#c08a1e"
      />

      <path d="M4.5 13h23" stroke="#fff6cc" strokeOpacity="0.8" />
    </Svg>
  );
}

export function DocumentIcon({ size = 16, className }: IconProps) {
  const id = useId();
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe6f2" />
        </linearGradient>
      </defs>

      <path d="M6.5 2.5h13l6 6v21h-19z" fill={`url(#${id}p)`} stroke="#7d8ba3" />

      <path d="M19.5 2.5v6h6" fill="#c9d3e3" stroke="#7d8ba3" strokeLinejoin="round" />

      <path
        d="M10 13h11M10 16.5h11M10 20h11M10 23.5h7"
        stroke="#4a78c8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CopyIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5.5 3.5h12l4 4v15h-16z" fill="#f4f6fb" stroke="#6b7c99" strokeWidth="2" />
      <path d="M11.5 9.5h12l4 4v15h-16z" fill="#ffffff" stroke="#3a64b4" strokeWidth="2" />
      <path d="M15 17h9M15 21h9M15 25h6" stroke="#3a64b4" strokeWidth="1.75" />
    </Svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 17l7 7L27 8"
        fill="none"
        stroke="#2f9a1f"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 17l7 7L27 8"
        fill="none"
        stroke="#8fe06b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  const id = useId();

  return (
    <Svg size={size} className={className}>
      <defs>
        <radialGradient id={`${id}g`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a9cdf5" />
        </radialGradient>
      </defs>

      <path d="M19 19l9 9" stroke="#7a5a2a" strokeWidth="5" strokeLinecap="round" />

      <circle cx="12.5" cy="12.5" r="8.5" fill={`url(#${id}g)`} stroke="#3b5f9a" strokeWidth="3" />
    </Svg>
  );
}

export function KeyIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="10" cy="16" r="6.5" fill="#f6d36b" stroke="#a87b12" strokeWidth="2" />
      <circle cx="8.5" cy="16" r="2" fill="#fff8dc" stroke="#a87b12" />
      <path d="M16 15h12v3h-3v4h-3v-4h-6z" fill="#f6d36b" stroke="#a87b12" strokeWidth="1.5" />
    </Svg>
  );
}

export function ListIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="3.5" y="4.5" width="25" height="23" rx="1.5" fill="#fff" stroke="#6b7c99" />
      <path d="M3.5 10.5h25" stroke="#6b7c99" />
      <rect x="4" y="5" width="24" height="5" fill="#d9e4f7" />
      <path d="M8 15h16M8 19h16M8 23h12" stroke="#3a64b4" strokeWidth="1.75" />
    </Svg>
  );
}

export function ErrorIcon({ size = 32, className }: IconProps) {
  const id = useId();
  return (
    <Svg size={size} className={className}>
      <defs>
        <radialGradient id={`${id}r`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff9b8a" />
          <stop offset="0.55" stopColor="#e5321b" />
          <stop offset="1" stopColor="#a8160a" />
        </radialGradient>
      </defs>

      <circle cx="16" cy="16" r="13.5" fill={`url(#${id}r)`} stroke="#8a1208" />

      <path d="M11 11l10 10M21 11L11 21" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 10, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M7 11l9 10 9-10z" fill="currentColor" />
    </Svg>
  );
}

export function MenuIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M6 9h20M6 16h20M6 23h20"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M9 9l14 14M23 9L9 23"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ExternalIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="16" cy="16" r="12.5" fill="#cfe6ff" stroke="#2a62c9" strokeWidth="2" />

      <path
        d="M4 16h24M16 3.5c-4 4-4 21 0 25M16 3.5c4 4 4 21 0 25"
        fill="none"
        stroke="#2a62c9"
        strokeWidth="1.5"
      />

      <path d="M8 9h16M8 23h16" stroke="#2a62c9" strokeWidth="1.25" />
    </Svg>
  );
}

export function SunIcon({ size = 16, className }: IconProps) {
  const id = useId();

  return (
    <Svg size={size} className={className}>
      <defs>
        <radialGradient id={`${id}s`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff7c2" />
          <stop offset="0.6" stopColor="#ffd23f" />
          <stop offset="1" stopColor="#f0a30a" />
        </radialGradient>
      </defs>

      <path
        d="M16 2v5M16 25v5M2 16h5M25 16h5M6.1 6.1l3.5 3.5M22.4 22.4l3.5 3.5M6.1 25.9l3.5-3.5M22.4 9.6l3.5-3.5"
        stroke="#e89a0c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <circle cx="16" cy="16" r="7" fill={`url(#${id}s)`} stroke="#c97f06" />
    </Svg>
  );
}

export function MoonIcon({ size = 16, className }: IconProps) {
  const id = useId();
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdf6d3" />
          <stop offset="1" stopColor="#d9c46a" />
        </linearGradient>
      </defs>

      <path
        d="M20.5 4.5A12 12 0 1 0 27.5 21 10 10 0 0 1 20.5 4.5z"
        fill={`url(#${id}m)`}
        stroke="#a8923a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
