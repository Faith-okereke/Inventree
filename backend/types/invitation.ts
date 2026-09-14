export interface invitationRequest {
    email: string,
    role: "admin" | "staff",
    businessId: string,
    invitedById: string,
    tokenHash: string,
    expiresAt: Date
}
export type invitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked'

export type acceptInvitationRequest = {
    token: string,
    name: string,
    password: string,
}