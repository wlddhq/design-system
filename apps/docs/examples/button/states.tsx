import { Button } from '@wldd/ui'

export default function States() {
  return (
    <>
      <Button size="sm" variant="ghost" pressed>List</Button>
      <Button size="sm" variant="ghost">Board</Button>
      <Button disabled>Pay vendors</Button>
      <Button href="#">As a link</Button>
    </>
  )
}
