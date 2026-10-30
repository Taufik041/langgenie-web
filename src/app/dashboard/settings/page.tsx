import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  return (
    <>
      <PageHeader title="Settings" description="Your profile and workspace." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Editing will be enabled once the production auth provider is connected.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Organisation", user.org || "—"],
            ["Member since", new Date(user.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-2">
              <Label>{k}</Label>
              <Input defaultValue={v} disabled />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
