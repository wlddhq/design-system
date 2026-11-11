import { Logo } from '@wldd/ui'
import { logo } from '../data'

export default function Brands() {
  return (
    <>
      <Logo name="Zomato" src={logo('zomato.com')} size={16} />
      <Logo name="Zepto" src={logo('zeptonow.com')} size={20} />
      <Logo name="Flipkart" src={logo('flipkart.com')} />
      <Logo name="CRED" src={logo('cred.club')} size={40} />
      <span className="mx-3 text-faint">·</span>
      <Logo name="Kulfi Studios" />
      <Logo name="Masala Media" size={40} />
    </>
  )
}
