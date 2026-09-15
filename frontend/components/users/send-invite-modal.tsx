"use client";

import { useState } from "react";

import { useSendInvitation } from "@/api-services/hooks/useInvitation";
import { DashboardModal } from "@/components/dashboard/dashboard-modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SendInviteRequest } from "../../../shared/types/invitation";


const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
] as const;

const emptyValues: SendInviteRequest = {
  email: "",
  role: "staff",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmailError(email: string) {
  const value = email.trim();
  if (!value) return "Email address is required.";
  if (!emailPattern.test(value)) return "Enter a valid email address.";
  return "";
}

export function SendInviteModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [values, setValues] = useState<SendInviteRequest>(emptyValues);
  const [emailTouched, setEmailTouched] = useState(false);
  const { mutate, isPending } = useSendInvitation();
  const emailError = getEmailError(values.email);

  const handleClose = () => {
    setValues(emptyValues);
    setEmailTouched(false);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    setEmailTouched(true);
    if (emailError) return;

    mutate(
      {
        email: values.email.trim(),
        role: values.role,
      },
      {
        onSuccess: handleClose,
      },
    );
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={handleClose}
      title="Invite User"
      description="Send an invitation to join the business with a role assignment."
    >
      <div className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium text-ink-700">
          <span>Email address</span>
          <input
            type="email"
            id="invite-email"
            value={values.email}
            required
            onChange={(e) =>
              setValues((current) => ({ ...current, email: e.target.value }))
            }
            onBlur={() => setEmailTouched(true)}
            aria-invalid={emailTouched && Boolean(emailError)}
            aria-describedby={emailTouched && emailError ? "invite-email-error" : undefined}
            className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-ink-300 focus:outline-none focus:ring-2 ${
              emailTouched && emailError
                ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20"
                : "border-ink-200 focus:border-brand-500 focus:ring-brand-500/20"
            }`}
            placeholder="name@company.com"
            
          />
          {emailTouched && emailError && (
            <p id="invite-email-error" className="text-xs font-normal text-danger-600">
              {emailError}
            </p>
          )}
        </label>

        <div className="space-y-1.5">
          <Select
            id="invite-role"
            label="Role"
            value={values.role}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                role: e.target.value as SendInviteRequest["role"],
              }))
            }
            options={roleOptions}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" disabled={isPending || Boolean(emailError)} onClick={handleSubmit}>
            {isPending ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
