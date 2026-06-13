"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("You're subscribed! Welcome to FORGE.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-amber-500 dark:bg-amber-600">
      <div className="max-w-xl mx-auto text-center text-white">
        <Mail className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-3">
          Stay in the Loop
        </h2>
        <p className="mb-8 opacity-90">
          Subscribe for exclusive drops, early access, and style updates.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-white/20 border-white/30 placeholder:text-white/70 text-white focus-visible:ring-white"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-white text-amber-600 hover:bg-white/90 gap-1 shrink-0"
          >
            {loading ? (
              "..."
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
