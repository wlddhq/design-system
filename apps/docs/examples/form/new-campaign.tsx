'use client'
import { useState } from 'react'
import { Laugh, Users, Rocket, Plus } from 'lucide-react'
import { Field, Input, Textarea, DateInput, MultiSelect, RadioGroup, Select, Button } from '@wldd/ui'
import { SERVICES } from '../data'

const CLIENTS = ['Zepto', 'Swiggy Instamart', 'Lenskart', 'boAt', 'Nykaa'].map((c) => ({ value: c, label: c }))

/** Every field type in one short form. Press Create with Name empty to see an error. */
export default function NewCampaign() {
  const [client, setClient] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<string | null>('meme')
  const [services, setServices] = useState<string[]>(['MEMD'])
  const [start, setStart] = useState('2026-12-01')
  const [brief, setBrief] = useState('')
  const [tried, setTried] = useState(false)
  return (
    <form className="w-form w-full max-w-[460px]" onSubmit={(e) => { e.preventDefault(); setTried(true) }}>
      <div className="w-form-row">
        <Field label="Client"><Select value={client} onChange={setClient} options={CLIENTS} placeholder="Pick a client" align="start" /></Field>
        <Field label="Start"><DateInput value={start} onChange={(e) => setStart(e.target.value)} /></Field>
      </div>
      <Field label="Name" error={tried && !name.trim() ? 'Give it a name, e.g. “Diwali Drop”' : undefined}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Diwali Drop" />
      </Field>
      <Field label="Type">
        <RadioGroup variant="cards" value={type} onChange={setType} options={[
          { value: 'meme', label: 'Meme', icon: Laugh }, { value: 'influencer', label: 'Influencer', icon: Users }, { value: 'launch', label: 'Launch', icon: Rocket },
        ]} />
      </Field>
      <Field label="Services"><MultiSelect value={services} onChange={setServices} options={Object.entries(SERVICES).map(([k, v]) => ({ value: k, label: k, hint: v }))} /></Field>
      <Field label="Brief" optional help="A few lines creators will read."><Textarea value={brief} onChange={(e) => setBrief(e.target.value)} /></Field>
      <div className="flex justify-end"><Button type="submit" variant="primary" icon={Plus}>Create</Button></div>
    </form>
  )
}
