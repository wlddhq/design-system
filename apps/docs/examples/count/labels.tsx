import { Count } from '@wldd/ui'

export default function Labels() {
  return (
    <>
      <span className="font-medium">Campaigns <Count>28</Count></span>
      <span className="mx-3 text-faint">·</span>
      <span className="font-medium">Approvals <Count>3</Count></span>
    </>
  )
}
