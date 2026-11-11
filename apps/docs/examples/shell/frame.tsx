import { House, Rocket, Wallet, Inbox, Megaphone, CheckCheck, Plus } from 'lucide-react'
import {
  WlddLogo, AppShell, Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, SidebarFooter,
  TopBar, TopBarTitle, TopBarActions, PageScroll, Page, Button, Avatar, Empty,
} from '@wldd/ui'

export default function Frame() {
  return (
    <AppShell style={{ height: '100%' }} sidebar={
      <Sidebar>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <SidebarHeader logo={<WlddLogo />} />
        <SidebarBody>
          <SidebarGroup icon={House} label="Home" />
          <SidebarGroup icon={Rocket} tone="green" label="Pod" open>
            <SidebarItem icon={Inbox} active>Inbox</SidebarItem>
            <SidebarItem icon={Megaphone}>Campaigns</SidebarItem>
            <SidebarItem icon={CheckCheck} count={3}>Approvals</SidebarItem>
          </SidebarGroup>
          <SidebarGroup icon={Wallet} tone="violet" label="Finance" count={22} />
        </SidebarBody>
        <SidebarFooter><Avatar name="Satish Hebbal" hue={330} size={24} />Satish</SidebarFooter>
      </Sidebar>
    }>
      <TopBar>
        <TopBarTitle icon={Inbox} title="Inbox" count={0} />
        <TopBarActions><Button variant="primary" icon={Plus}>New</Button></TopBarActions>
      </TopBar>
      <PageScroll><Page><Empty icon={Inbox} title="Clear" /></Page></PageScroll>
    </AppShell>
  )
}
