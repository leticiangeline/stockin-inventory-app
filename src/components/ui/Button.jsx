const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold ' +
  'transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variantClasses = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100',
}

const sizeClasses = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4',
}

function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}

export default Button