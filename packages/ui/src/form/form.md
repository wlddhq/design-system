---
name: Form fields
component: Field
parts: Textarea, DateInput, RadioGroup, MultiSelect
summary: A label, one control, and a hint or error. Text, long text, dates, one-of-few and many-of-many.
status: stable
group: records
---

## When to use

- Every form control sits in a `Field`: Input, Textarea, DateInput, Select, RadioGroup, MultiSelect.
- **Select** for one of many; **RadioGroup** for one of two to five you want visible; **MultiSelect** for several (team, services).

## Do

- Labels are nouns, one or two words: "Client", "Budget", "Start date". No colons.
- Mark the few skippable fields `optional`. Everything else is expected, so no asterisks.
- Put the fix in the error: "Budget must be at least ₹1L", not "Invalid value".
- Show errors when people leave a field or submit, never while they're typing.
- Wrap fields in `<div className="w-form">`; pair short ones in `<div className="w-form-row">`.
- `RadioGroup variant="cards"` with icons for two to four visual choices (campaign type).

## Don't

- Don't use placeholder text as the label.
- Don't disable the submit button to signal errors. Let people press it, then show what's missing.

## Edge cases

- Field wires its label, hint and error to the control for screen readers.
- An error replaces the hint and turns the control pink.
- Textarea grows with its text up to about 12 lines.
- MultiSelect shows two choices, then "+n"; its search appears past seven options. Enter picks the top match.
- A MultiSelect or Select with no options is disabled.
