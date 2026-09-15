import { api } from "./client";
import type {
  acceptInvitationRequest,
  SendInvitationInput,
} from "../../../shared/types/invitation";

export const acceptInvitation = async (acceptInvite: acceptInvitationRequest) => {
  const response = await api.post(`/invitation/accept?token=${acceptInvite.token}`, {
    name: acceptInvite.name,
    password: acceptInvite.password,
  });
  return response.data;
};

export const sendInvitation = async (data: SendInvitationInput) => {
  const response = await api.post("/invitation/send", data);
  return response.data;
};

export const revokeInvitation = async (invitationId: string) => {
  const response = await api.post(`/invitation/revoke/${invitationId}`);
  return response.data;
};