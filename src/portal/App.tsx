import Dashboard from './Dashboard'
import ChatBubble from './ChatBubble'
import type { PortalMember, PortalTenantIdentity } from './api'

const DEMO_MEMBER: PortalMember = {
  id: 'demo-daniel-mira',
  name: 'Daniel & Mira',
  email: 'daniel@example.com',
  tenant: 'maya',
}

const DEMO_TENANT: PortalTenantIdentity = {
  slug: 'maya',
  name: 'Maya Sterling, CFP®',
  agent_name: 'Maya Sterling, CFP®',
  agent_avatar_url: null,
  agent_bio: 'Fee-only fiduciary advisor. Ex-software engineer. Built this portal for you.',
}

export default function App() {
  return (
    <>
      <Dashboard member={DEMO_MEMBER} tenant={DEMO_TENANT} onSignOut={() => { window.location.href = '/' }} />
      <ChatBubble tenant={DEMO_TENANT} />
    </>
  )
}
