import { getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
    AcceptInvitationResponse,
    acceptInvitationRequest,
    SendInvitationInput,
} from "../../../shared/types/invitation";
import { acceptInvitation, revokeInvitation, sendInvitation } from "../services/invitation.service";
import { saveAuthSession } from "@/lib/auth/session";
import { setAuth } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/hooks";

export const useAcceptInvitation = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation<AcceptInvitationResponse, unknown, acceptInvitationRequest>({
        mutationFn: (acceptInvite: acceptInvitationRequest) => acceptInvitation(acceptInvite),
        onSuccess: async (res: AcceptInvitationResponse) => {
            await queryClient.invalidateQueries({ queryKey: ["acceptInvitation"] });
            const authData = { token: res.token, user: res.user };
            console.log("Auth data after accepting invitation:", authData);
            saveAuthSession(authData);
            dispatch(setAuth(authData));
            toast.success("Invitation accepted successfully");
        },
        onError: (error: unknown) => {
            const errorMessage = getApiErrorMessage(error);
            console.error("API ERROR DETAILS:", error);
            
            toast.error(errorMessage);
        },
    });
};

export const useSendInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<unknown>, unknown, SendInvitationInput>({
        mutationFn: (data: SendInvitationInput) => sendInvitation(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["sendInvitation"] });
            toast.success("Invitation sent successfully");
        },
        onError: (error: unknown) => {
            const errorMessage = getApiErrorMessage(error);
            console.error("API ERROR DETAILS:", error);
            toast.error(errorMessage);
        },
    });
};

export const useRevokeInvitation = (invitationId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => revokeInvitation(invitationId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
            toast.success("Invitation revoked successfully");
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};