"use client";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  return (
    <form
      className="rounded-3xl border bg-card p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700)); // mock submit
        setLoading(false);
        (e.target as HTMLFormElement).reset();
        toast.success("Thanks! We’ll be in touch shortly.");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required placeholder="you@company.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">Organisation</Label>
          <Input id="company" placeholder="Company or department" />
        </div>
        <div className="grid gap-2">
          <Label>Interested in</Label>
          <Select defaultValue="both">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="odia-odia">Odia → Odia</SelectItem>
              <SelectItem value="odia-english">Odia → English</SelectItem>
              <SelectItem value="both">Both models</SelectItem>
              <SelectItem value="deploy">Private / on-prem deployment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="msg">How can we help?</Label>
          <Textarea id="msg" rows={5} placeholder="Tell us about your use case, expected audio volume and timelines." />
        </div>
      </div>
      <Button type="submit" shape="pill" className="mt-6 h-11 w-full" disabled={loading}>
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
