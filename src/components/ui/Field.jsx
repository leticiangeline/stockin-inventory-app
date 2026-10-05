const BASE_INPUT_CLASS =
  'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 shadow-sm ' +
  'placeholder:text-slate-400 transition-colors focus:border-brand-500'

/**
 * Labelled form input with inline validation message.
 * Keeps the shared input styling in one place so every modal field matches.
 */
function Field({
  label,
  htmlFor,
  error,
  hint,
  className = '',
  type = 'text',
  value,
  onChange,
  ...props
}) {
  const borderClass = error ? 'border-red-400' : 'border-slate-300'

  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-semibold text-slate-600"
      >
        {label}
      </label>
      <input
        id={htmlFor}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${htmlFor}-error` : undefined}
        className={`${BASE_INPUT_CLASS} ${borderClass}`}
        {...props}
      />
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

export default Field