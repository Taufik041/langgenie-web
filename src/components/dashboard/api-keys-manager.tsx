"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, KeyRound, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyButton } from "@/components/site/code-block";

type Key = { id: string; name: string; prefix: string; createdAt: string; lastUsedAt: string | null; revokedAt: string | null };
const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Never");

export function ApiKeysManager({ initial }: { initial: Key[] }) {
  const router = useRouter();
  const [keys, setKeys] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [secret, setSecret] = React.useState<string | null>(null);
  const [revoking, setRevoking] = React.useState<Key | null>(null);

  async function create() {
    setLoading(true);
    const res = await fetch("/api/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error ?? "Could not create key");
    setKeys((k) => [data.key, ...k]);
    setSecret(data.secret);
    setName("");
    router.refresh();
  }

  async function revoke(k: Key) {
    const res = await fetch(`/api/keys/${k.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Could not revoke key");
    setKeys((all) => all.map((x) => (x.id === k.id ? { ...x, revokedAt: new Date().toISOString() } : x)));
    setRevoking(null);
    toast.success(`Revoked “${k.name}”`);
  }

  const active = keys.filter((k) => !k.revokedAt);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{active.length} of 10 active keys</p>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setSecret(null);
          }}
        >
          <DialogTrigger asChild>
            <Button shape="pill">
              <Plus /> Create new key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {secret ? (
              <>
                <DialogHeader>
                  <DialogTitle>Save your API key</DialogTitle>
                  <DialogDescription>This is the only time the full key is shown. Store it somewhere safe — you won’t be able to see it again.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 rounded-xl border bg-muted/60 p-3">
                  <code className="min-w-0 flex-1 break-all font-mono text-[13px]">{secret}</code>
                  <CopyButton value={secret} />
                </div>
                <p className="flex items-start gap-2 rounded-lg bg-accent p-3 text-xs text-[#8a3b00]">
                  <AlertTriangle className="mt-px size-4 shrink-0" /> Never expose this key in client-side code or public repositories.
                </p>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API key</DialogTitle>
                  <DialogDescription>Give it a name so you can recognise it later, e.g. “Production server”.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="keyname">Key name</Label>
                  <Input id="keyname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Production server" maxLength={60} onKeyDown={(e) => e.key === "Enter" && create()} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={create} disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />} Create key
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="py-0">
        <CardContent className="px-0">
          {keys.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-[#b44d00]">
                <KeyRound className="size-5" />
              </span>
              <p className="mt-4 font-medium">No API keys yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Create a key to start calling the Odia → Odia and Odia → English APIs from your app.</p>
              <Button className="mt-6" shape="pill" onClick={() => setOpen(true)}>
                <Plus /> Create your first key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id} className={k.revokedAt ? "opacity-55" : ""}>
                    <TableCell className="pl-6 font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs">{k.prefix}••••••••••••</TableCell>
                    <TableCell className="text-muted-foreground">{fmt(k.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{fmt(k.lastUsedAt)}</TableCell>
                    <TableCell>{k.revokedAt ? <Badge variant="secondary">Revoked</Badge> : <Badge variant="success">Active</Badge>}</TableCell>
                    <TableCell className="pr-6 text-right">
                      {!k.revokedAt && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${k.name}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem variant="destructive" onSelect={() => setRevoking(k)}>
                              <Trash2 /> Revoke key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!revoking} onOpenChange={(o) => !o && setRevoking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke “{revoking?.name}”?</DialogTitle>
            <DialogDescription>Any application using this key will immediately stop working. This can’t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevoking(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => revoking && revoke(revoking)}>
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-6 text-sm text-muted-foreground">
        New to the API? Read <Link href="/docs/authentication" className="underline underline-offset-4">Authentication</Link> and the{" "}
        <Link href="/docs/quickstart" className="underline underline-offset-4">Quickstart</Link>.
      </p>
    </>
  );
}
