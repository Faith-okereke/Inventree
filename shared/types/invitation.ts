export type InvitationRole = "admin" | "staff";

export interface SendInvitationInput {
  email: string;
  role: InvitationRole;
}

export interface InvitationRequest {
    email: string;
    role: InvitationRole;
    businessId: string;
    invitedById: string;
    tokenHash: string;
    expiresAt: Date;
}

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "revoked";

export type AcceptInvitationRequest = {
    token: string;
    name: string;
    password: string;
};

export type invitationRequest = InvitationRequest;
export type invitationStatus = InvitationStatus;
export type acceptInvitationRequest = AcceptInvitationRequest;
import type { AuthUser } from "./auth";

export type AcceptInvitationResponse = {
    message: string;
    token: string;
    user: AuthUser;
    membership: {
        id: string;
        role: string;
        businessId: string;
    };
};
export type SendInviteRequest = SendInvitationInput;