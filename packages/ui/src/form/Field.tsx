import { cloneElement, forwardRef, isValidElement, useId, type InputHTMLAttributes, type ReactElement, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { CalendarDays, CircleAlert } from 'lucide-react'
import { cx } from '../cx'

export type FieldProps = {
  /** One or two words: "Client", "Budget", "Start date". */
  label: string
  /** One control: Input, Textarea, DateInput, MultiSelect, Select or RadioGroup. Field wires its id and messages to it. */
  children: ReactElement
  /** A short hint under the control. Hidden while there's an error. */
  help?: ReactNode
  /** What's wrong, and how to fix it: "Budget must be at least ₹1L". Turns the control pink. */
  error?: ReactNode
  /** Mark the few fields people may skip. Everything else is expected. */
  optional?: boolean
  className?: string
}

/** A label, one control, and a hint or error under it. Every form control sits in one. */
export function Field({ label, children, help, error, optional, className }: FieldProps) {
  const id = useId()
  const msg = error != null ? id + 'e' : help != null ? id + 'h' : undefined
  const control = isValidElement<Record<string, unknown>>(children)
    ? cloneElement(children, { id: (children.props.id as string) ?? id, 'aria-describedby': msg, 'aria-invalid': error != null || undefined })
    : children
  return (
    <div className={cx('w-field', className)} data-invalid={error != null || undefined}>
      <label className="w-field-l" htmlFor={(isValidElement<{ id?: string }>(children) && children.props.id) || id}>
        {label}{optional && <span className="w-field-opt">Optional</span>}
      </label>
      {control}
      {error != null ? <span id={id + 'e'} className="w-field-err" role="alert"><CircleAlert size={13} aria-hidden />{error}</span>
        : help != null ? <span id={id + 'h'} className="w-field-help">{help}</span> : null}
    </div>
  )
}

export type TextareaProps = {
  /** Visible lines before it starts growing. @default 3 */
  rows?: number
  /** Grows with its text up to about 12 lines. @default true */
  autoGrow?: boolean
  className?: string
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'rows'>

/** Several lines of text: a brief, a note, a rejection reason. Looks like Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ rows = 3, autoGrow = true, className, ...rest }, ref) {
  return <textarea ref={ref} rows={rows} className={cx('w-input w-textarea', className)} data-grow={autoGrow || undefined} {...rest} />
})

export type DateInputProps = {
  /** 'YYYY-MM-DD' */
  value?: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'value' | 'size'>

/** A date, with the browser's own calendar. Values are 'YYYY-MM-DD'. */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput({ className, ...rest }, ref) {
  return (
    <label className={cx('w-input w-date', className)}>
      <CalendarDays size={15} aria-hidden />
      <input ref={ref} type="date" {...rest} />
    </label>
  )
})
