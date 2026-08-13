"use client";

// import { useEffect } from "react";

// import { AppIcon, icons } from "@/components/ui/app-icon";
// import { Button } from "@/components/ui/button";

// /**
//  * Root error boundary. Error boundaries must be Client Components.
//  *
//  * Next 16 passes `retry` (not `reset`) — calling it re-renders the segment, which
//  * is enough to recover from a transient failure.
//  */
// export default function RootError({
//   error,
//   retry,
// }: {
//   error: Error & { digest?: string };
//   retry: () => void;
// }) {
//   useEffect(() => {
//     // Stands in for a reporting service. In production `error.message` is a
//     // generic string; `error.digest` is what matches the server-side log.
//     console.error(error);
//   }, [error]);

//   return (
//     <main className="flex flex-1 items-center justify-center bg-ink-100 px-4 py-16">
//       <div className="animate-fade-up w-full max-w-md text-center">
//         <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger-50 text-danger-600">
//           <AppIcon name={icons.alert} className="size-7" />
//         </span>

//         <h1 className="mt-6 text-xl font-bold text-ink-900 sm:text-2xl">
//           Something went wrong
//         </h1>
//         <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
//           The page failed to render. Trying again often clears it — the cause can
//           be temporary.
//         </p>

//         {error.digest && (
//           <p className="mt-4 font-mono text-xs text-ink-400">
//             Reference: {error.digest}
//           </p>
//         )}

//         <div className="mt-7 flex justify-center">
//           <Button onClick={retry}>Try again</Button>
//         </div>
//       </div>
//     </main>
//   );
// }
