import { getCurrentUser } from "@/lib/auth";
import { listKeys } from "@/lib/api-keys";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApiKeysManager } from "@/components/dashboard/api-keys-manager";

export const metadata = { title: "API Keys" };

export default async function ApiKeysPage() {
  const user = (await getCurrentUser())!;
  return (
    <>
      <PageHeader title="API Keys" description="Authenticate requests by sending your key in the api-subscription-key header." />
      <ApiKeysManager initial={await listKeys(user.id)} />
    </>
  );
}
