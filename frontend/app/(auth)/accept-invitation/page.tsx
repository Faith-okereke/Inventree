import { Suspense } from "react";
import AcceptInvitationForm from "./accept-invitation";

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationForm />
    </Suspense>
  );
}