export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PeerHelpBoard } from "@/components/peer-help/peer-help-board";
import { normalizePeerHelpType } from "@/lib/peer-help/types";
import { getPeerHelpRequests } from "./actions";

type Search = { type?: string; openRequest?: string };

export default async function PeerHelpPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=" + encodeURIComponent("/peer-help"));
  }
  const userId = session.user.id;
  const requests = await getPeerHelpRequests();
  const sp = await searchParams;
  const initialRequestType = normalizePeerHelpType(
    typeof sp.type === "string" ? sp.type : undefined,
  );
  const autoOpenRequest =
    sp.openRequest === "1" || sp.openRequest === "true";

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PeerHelpBoard
          initialRequests={requests}
          currentUserId={userId}
          initialRequestType={initialRequestType}
          autoOpenRequest={autoOpenRequest}
        />
      </div>
    </main>
  );
}
