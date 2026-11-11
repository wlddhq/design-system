import { Loader } from '@wldd/ui'

export default function Inline() {
  return (
    <>
      <Loader kind="ring" size={20} label="Saving" />
      <Loader kind="notch" size={20} label="Syncing Tally" />
      <Loader kind="ai" size={20} label="Thinking" />
    </>
  )
}
