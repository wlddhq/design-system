/* Fake data for examples, shaped like the DMS. Real brands get real logos (favicon service, as in the prototype). */
import type { Person, Tone } from '@wldd/ui'

export const logo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

export const PEOPLE: Record<string, Person> = {
  KM: { name: 'Kirsten Menezes', hue: 150 }, ZK: { name: 'Zoya Khan', hue: 250 }, DM: { name: 'Dev Mehta', hue: 40 },
  RK: { name: 'Riya Kapoor', hue: 285 }, MN: { name: 'Meera Nair', hue: 320 }, AS: { name: 'Arjun Sen', hue: 15 },
  AI: { name: 'Aisha Iqbal', hue: 350 }, IR: { name: 'Ishaan Rao', hue: 85 }, MI: { name: 'Mihir Iyer', hue: 300 },
}
const team = (...ids: string[]) => ids.map((i) => PEOPLE[i]!)

export const STAGES = ['Brief', 'Team Allocation', 'Pitch Details', 'Campaign Details', 'Activation', 'Campaign Report', 'Complete'] as const
/** One tone map for the whole product: neutral before the brief, yellow while set up, green live, violet complete. */
export const stageTone = (s: number): Tone => (s === 6 ? 'violet' : s >= 4 ? 'green' : s >= 1 ? 'yellow' : 'neutral')

export const SERVICES: Record<string, string> = {
  AMP: 'Amplification', INF: 'Influencer', MEMD: 'Meme marketing', ACA: 'Academy', CC: 'Creator content', ORM: 'Reputation', OFF: 'Offline', SOLO: 'Solo creator', TT: 'Trend takeover',
}

export type Campaign = {
  id: string; client: string; domain: string; activity: string; code: string; stage: number
  services: string[]; team: Person[]; budget: number; updated: string; pod: 'Kulfi' | 'Neon' | 'Masala'
  /** Derived below: when it runs, the lead, and a 12-point views trend for cards. */
  start: Date; end: Date; lead: Person; trend: number[]
}

/** A fixed "today", so server and browser draw the same timeline. */
export const TODAY = new Date(2026, 10, 11)
const DAY = 864e5

const RAW: Omit<Campaign, 'start' | 'end' | 'lead' | 'trend'>[] = [
  { id: '1', client: 'Lenskart', domain: 'lenskart.com', activity: 'Wrapped', code: 'WL-2421', stage: 0, services: ['AMP', 'MEMD'], team: team('KM', 'ZK'), budget: 31, updated: '2h', pod: 'Kulfi' },
  { id: '2', client: 'Zepto', domain: 'zeptonow.com', activity: 'Always-on Q4', code: 'WL-2417', stage: 4, services: ['INF'], team: team('DM', 'RK'), budget: 22, updated: '4h', pod: 'Neon' },
  { id: '3', client: 'Swiggy Instamart', domain: 'swiggy.com', activity: 'New Album', code: 'WL-2412', stage: 4, services: ['INF', 'AMP'], team: team('ZK', 'AI', 'IR'), budget: 50, updated: '8h', pod: 'Masala' },
  { id: '4', client: 'Krafton India', domain: 'krafton.com', activity: 'Launch Week', code: 'WL-2419', stage: 3, services: ['AMP', 'ACA'], team: team('AS', 'AI'), budget: 73, updated: '17h', pod: 'Kulfi' },
  { id: '5', client: 'District', domain: 'district.in', activity: 'Always-on Q4', code: 'WL-2403', stage: 4, services: ['AMP'], team: team('KM', 'DM', 'MN'), budget: 58, updated: '18h', pod: 'Neon' },
  { id: '6', client: 'boAt', domain: 'boat-lifestyle.com', activity: 'Store Opening', code: 'WL-2413', stage: 3, services: ['AMP'], team: team('AS', 'DM', 'MN'), budget: 19, updated: '1d', pod: 'Masala' },
  { id: '7', client: 'Mamaearth', domain: 'mamaearth.in', activity: 'Match Day', code: 'WL-2420', stage: 1, services: ['OFF', 'INF'], team: team('RK', 'DM'), budget: 44, updated: '1d', pod: 'Kulfi' },
  { id: '8', client: 'WMG', domain: 'wmg.com', activity: 'App Push', code: 'WL-2409', stage: 5, services: ['AMP', 'ACA'], team: team('KM', 'AS', 'AI'), budget: 75, updated: '1d', pod: 'Neon' },
  { id: '9', client: 'Zomato', domain: 'zomato.com', activity: 'Festive Edit', code: 'WL-2411', stage: 0, services: ['AMP', 'MEMD'], team: team('DM', 'KM', 'ZK'), budget: 35, updated: '2d', pod: 'Masala' },
  { id: '10', client: 'Flipkart', domain: 'flipkart.com', activity: 'Festive Edit', code: 'WL-2425', stage: 6, services: ['MEMD', 'TT'], team: team('AS', 'IR', 'KM'), budget: 76, updated: '2d', pod: 'Kulfi' },
  { id: '11', client: 'CRED', domain: 'cred.club', activity: 'Creator Week', code: 'WL-2414', stage: 1, services: ['INF', 'SOLO'], team: team('RK', 'ZK'), budget: 72, updated: '2d', pod: 'Neon' },
  { id: '12', client: 'Nykaa', domain: 'nykaa.com', activity: 'Diwali Drop', code: 'WL-2415', stage: 2, services: ['MEMD', 'TT'], team: team('KM', 'IR', 'KM'), budget: 27, updated: '3d', pod: 'Masala' },
]

// Earlier stages start later; complete ones finished recently. Deterministic, so every render matches.
export const CAMPAIGNS: Campaign[] = RAW.map((c, i) => {
  const offset = [28, 18, 10, 2, -20, -46, -70][c.stage]! + ((i * 7) % 11) - 5
  const start = new Date(TODAY.getTime() + offset * DAY)
  const end = new Date(start.getTime() + (28 + ((i * 13) % 5) * 7) * DAY)
  const trend = Array.from({ length: 12 }, (_, k) => Math.round(20 + k * (c.stage >= 4 ? 6 : 2) + ((k * (i + 3) * 17) % 23)))
  return { ...c, start, end, lead: c.team[0]!, trend }
})

export const inr = (lakh: number) => `₹${lakh}L`
