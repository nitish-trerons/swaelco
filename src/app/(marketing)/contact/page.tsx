import { Metadata } from "next";
import { Mail, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="container grid gap-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Contact Sales</p>
        <h1 className="text-4xl font-black tracking-tight text-white">Plan Your Elevator Project With Clear Numbers</h1>
        <p className="text-slate-300">
          Share building details and timeline goals. We’ll return with scope options, timeline assumptions, and
          compliance checkpoints.
        </p>

        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/75 p-4 text-sm text-slate-300">
          <p className="flex items-center gap-2 text-slate-100"><PhoneCall className="h-4 w-4 text-blue-300" /> Emergency hotline: +1 (555) 981-1200</p>
          <p className="flex items-center gap-2 text-slate-100"><Mail className="h-4 w-4 text-blue-300" /> Email: support@swaelco.com</p>
          <p>Average first response for commercial quote requests: within 1 business day.</p>
        </div>
      </div>

      <Card className="border-white/10 bg-slate-900/85">
        <CardHeader>
          <CardTitle className="text-white">Request a Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" aria-label="Contact sales form">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Towers" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site">Site City</Label>
                <Input id="site" placeholder="Bhubaneswar" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 555 200 1900" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Needed</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_installation">New installation</SelectItem>
                  <SelectItem value="modernization">Modernization</SelectItem>
                  <SelectItem value="repair">Repair and corrective work</SelectItem>
                  <SelectItem value="inspection">Inspection and safety audit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Project Details</Label>
              <Textarea id="message" placeholder="Floors, number of cars, expected timeline, constraints, and permit status." />
            </div>

            <Button type="submit" className="w-full bg-red-500 text-white hover:bg-red-400">
              Submit Inquiry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
