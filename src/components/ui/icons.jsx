// Minimal inline SVG icon set (no external icon dependency).
function createIcon(displayName, paths) {
  const Icon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths}
    </svg>
  )
  Icon.displayName = displayName
  return Icon
}

export const PlusIcon = createIcon(
  'PlusIcon',
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
)

export const DownloadIcon = createIcon(
  'DownloadIcon',
  <>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </>,
)

export const BoxesIcon = createIcon(
  'BoxesIcon',
  <>
    <path d="M12 2 3 7v10l9 5 9-5V7z" />
    <path d="M3 7l9 5 9-5" />
    <path d="M12 22V12" />
  </>,
)

export const TagIcon = createIcon(
  'TagIcon',
  <>
    <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </>,
)

export const AlertIcon = createIcon(
  'AlertIcon',
  <>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>,
)

export const DollarIcon = createIcon(
  'DollarIcon',
  <>
    <path d="M12 2v20" />
    <path d="M17 6.5A4 4 0 0 0 13 5h-2a4 4 0 0 0 0 8h2a4 4 0 0 1 0 8h-2a4 4 0 0 1-4-1.5" />
  </>,
)

export const LayersIcon = createIcon(
  'LayersIcon',
  <>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </>,
)

export const SearchIcon = createIcon(
  'SearchIcon',
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </>,
)

export const CloseIcon = createIcon(
  'CloseIcon',
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>,
)

export const CheckIcon = createIcon(
  'CheckIcon',
  <path d="m4.5 12.5 5 5 10-11" />,
)