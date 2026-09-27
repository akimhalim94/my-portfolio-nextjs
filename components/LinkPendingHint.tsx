"use client";

import { useLinkStatus } from "next/link";

// Inline feedback for a navigation that is taking longer than expected. Must be
// rendered inside a <Link>.
//
// This exists mainly for `next dev`, where link prefetching is disabled and every
// click waits on a cold server render. The transition engine freezes painting
// while it waits, so without this the click looks like it did nothing. In a
// production build the routes are prefetched, `pending` goes false almost
// immediately, and the animation delay keeps the hint from ever appearing.
export default function LinkPendingHint() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={pending ? "link-hint is-pending" : "link-hint"}
    />
  );
}
