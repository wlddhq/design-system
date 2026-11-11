import { DocPage, H2 } from '@/components/Doc'
import { Example } from '@/components/ComponentDoc'

export const metadata = { title: 'Campaign' }

export default function Page() {
  return (
    <DocPage wide href="/showcase/campaign" lead="One campaign’s own page, rebuilt with nothing but @wldd/ui: where it stands, its numbers, its people, and how to change it.">
      <H2>Live screen</H2>
      <p>Press “Move to Activation” and watch the stepper, then Undo from the toast. Edit (the pencil) opens a sheet with the form; leave Name empty and Save to see an error. More › Delete asks first.</p>
      <Example id="showcase/campaign" frame={720} />

      <H2>What it’s made of</H2>
      <ul>
        <li><strong>Page:</strong> RecordHeader (Logo, title, meta, actions), Stepper, underline Tabs, RecordLayout with Metrics and a PropertyList.</li>
        <li><strong>Editing:</strong> a Sheet holding Fields: Input, Textarea, DateInput, MultiSelect (services, team) and RadioGroup (pod).</li>
        <li><strong>Confirming:</strong> a Dialog before deleting. Everything else acts at once and offers Undo in a toast.</li>
        <li><strong>Feedback:</strong> Toaster and toast, TextMorph on the primary button.</li>
      </ul>
    </DocPage>
  )
}
