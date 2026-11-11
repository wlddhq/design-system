import { DotLabel } from '@wldd/ui'

export default function Labels() {
  return (
    <>
      <DotLabel shape="square" tone="green">Kulfi</DotLabel>
      <DotLabel shape="square" tone="violet">Neon</DotLabel>
      <DotLabel shape="square" tone="yellow">Masala</DotLabel>
      <span className="mx-3 text-faint">·</span>
      <DotLabel tone="green">Live</DotLabel>
      <DotLabel tone="pink">Paused</DotLabel>
    </>
  )
}
