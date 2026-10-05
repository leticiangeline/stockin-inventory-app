/**
 * Centred, max-width page container with consistent horizontal gutters.
 *
 * The header, navigation tabs and main content all render through this so their
 * left/right edges line up exactly at every breakpoint. Without it, the header,
 * tabs and panels would drift apart as the padding values change.
 */
function Container({ className = '', children, ...props }) {
  const classes = [
    'mx-auto w-full max-w-7xl',
    // Breathing room so content never touches the viewport edge.
    'px-4 sm:px-6 lg:px-8',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Container