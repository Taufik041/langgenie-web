import { ContactForm } from "./contact-form";
import { Mail, Building2, Handshake } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="relative -mt-16 overflow-hidden pt-16">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-light sm:text-6xl">Let’s talk</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Planning an Odia voice rollout, a private deployment, or a partnership? Tell us a bit about it and our team will get back within one business day.
          </p>
          <div className="mt-12 space-y-6">
            {[
              { i: Building2, t: "Enterprise & government", d: "Private cloud, on-prem, SLAs and volume pricing." },
              { i: Handshake, t: "Partnerships", d: "System integrators, telecom and contact-centre platforms." },
              { i: Mail, t: "Everything else", d: "Product questions, press, careers." },
            ].map((x) => (
              <div key={x.t} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-[#b44d00]">
                  <x.i className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{x.t}</p>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm text-muted-foreground">
            langgenie.ai is a product of <b className="text-foreground">BIPROS</b>.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
