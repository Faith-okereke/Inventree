"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMeService } from "@/api-services/services/auth.service";
import { clearAuthSession, saveAuthSession } from "@/lib/auth/session";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth, setAuth } from "@/store/slices/auth.slice";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      router.replace("/login?error=google_callback_failed");
      return;
    }

    saveAuthSession({ token, user: null });

    getMeService()
      .then((response) => {
        const session = { token, user: response.data };
        saveAuthSession(session);
        dispatch(setAuth(session));
        router.replace("/dashboard");
      })
      .catch(() => {
        clearAuthSession();
        dispatch(clearAuth());
        router.replace("/login?error=google_callback_failed");
      });
  }, [dispatch, router]);

  return <p className="text-sm text-stone-600">Signing you in with Google...</p>;
}
