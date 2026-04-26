// Demo portal — no backend. Types are kept for the Dashboard + ChatBubble
// components that still reference them.

export interface PortalMember {
  id: string
  name: string
  email?: string
  tenant?: string
}

export interface PortalTenantIdentity {
  slug: string
  name: string
  agent_name: string | null
  agent_avatar_url: string | null
  agent_bio: string | null
}
