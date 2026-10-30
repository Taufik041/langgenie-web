import { getCurrentUser } from "@/lib/auth";
import { getUsage } from "@/lib/usage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/page-header";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { getModel } from "@/lib/models";

export const metadata = { title: "Usage" };

export default async function UsagePage() {
  const user = (await getCurrentUser())!;
  const u = await getUsage(user.id, 30);
  return (
    <>
      <PageHeader title="Usage" description="Requests, audio minutes and estimated spend for your workspace." />
      <Card>
        <CardHeader>
          <CardTitle>Audio processed · last 30 days</CardTitle>
          <CardDescription>{(u.seconds / 60).toFixed(1)} minutes total · est. ₹{u.cost.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <UsageChart data={u.byDay} />
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {u.byModel.map((m) => (
          <Card key={m.model.id} className="gap-3">
            <CardHeader>
              <CardDescription>{m.model.name}</CardDescription>
              <CardTitle className="font-display text-2xl font-light">₹{m.cost.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {m.requests} requests · {(m.seconds / 60).toFixed(1)} min · ₹{m.model.pricePerHour}/hr
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent requests</CardTitle>
        </CardHeader>
        <CardContent>
          {u.recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No requests yet. Try the Playground or call the API with a key.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {u.recent.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{getModel(r.model)?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.source === "api" ? "API" : "Playground"}</Badge>
                    </TableCell>
                    <TableCell>{r.seconds.toFixed(1)}s</TableCell>
                    <TableCell>
                      <Badge variant="success">{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{new Date(r.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
