import { Suspense } from "react";

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationPage />
    </Suspense>
  );
}