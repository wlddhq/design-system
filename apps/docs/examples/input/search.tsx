import { Search } from 'lucide-react'
import { Input } from '@wldd/ui'

export default function SearchField() {
  return <Input icon={Search} kbd="/" placeholder="Search campaigns…" className="w-72" />
}
