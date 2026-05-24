interface LogoProps {
  className?: string;
  size?: number;
}

export default function FigureOutLogo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="figure-out-branding-logo"
    >
      {/* Upper-left & bottom-right green circular swooshes */}
      <path
        d="M 28 58 C 22.5 44 26 28.5 38 21.5 C 50 14.5 67.5 16 77 26"
        stroke="#0fb58c"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 72.5 45 C 75.5 61 68 76.5 53.5 81 C 39 85.5 28 78 22 71.5"
        stroke="#0fb58c"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* High-end italicized Yellow/Orange F character */}
      {/* Styled to resemble the dynamic italic letter wrapping the circle */}
      <path
        d="M 29.5 72 L 53 26.5 L 78 26.5 M 48 46 L 68 46"
        stroke="#f9a007"
        strokeWidth="11.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
