'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button, Dialog } from '@wldd/ui'

/** Ask only before what can't be undone. */
export default function Confirm() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button icon={Trash2} onClick={() => setOpen(true)}>Delete campaign</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete campaign?" width={420}
        description="Zepto × Always-on Q4 and its plan, tracker and report go for good. Invoices stay in Finance."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" icon={Trash2} onClick={() => setOpen(false)}>Delete</Button></>} />
    </>
  )
}
