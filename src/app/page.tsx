"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInvites() {
      const res = await fetch("/api/dashboard/invites");
      if (res.ok) {
        const json = await res.json();
        setInvites(json);
      }
    }
    fetchInvites();
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      const syncUser = async () => {
        try {
          const res = await fetch("/api/auth/sync", { method: "POST" });
          const data = await res.json();
          setOrgs(data.orgs || []);
        } catch (err) {
          console.error("Sync failed", err);
        } finally {
          setLoading(false);
        }
      };

      syncUser();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-6">
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-center">
          StatusHQ
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl mb-8">
          Monitor, manage, and communicate service status to your users.
        </p>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="secondary" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="default" size="lg">
              Signup
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Welcome, {user.fullName}!</h2>
        <SignOutButton>
          <Button variant="outline">Logout</Button>
        </SignOutButton>
      </div>

      {orgs.length === 0 ? (
        <p className="text-muted-foreground">
          You’re not part of any organizations yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {orgs.map((org) => (
            <li
              key={org.id}
              className="p-4 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <div className="font-medium">{org.name}</div>
              <Link href={`org/${org.id}`}>
                <Button className="mt-2" size="sm">
                  View Dashboard
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {invites.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Pending Invites</h2>
          <ul className="space-y-2">
            {invites.map((invite: any) => (
              <li
                key={invite.id}
                className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded space-y-1"
              >
                <p>
                  <span className="font-semibold">Organization ID:</span>{" "}
                  {invite.orgId}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> {invite.role}
                </p>
                <Button
                  onClick={async () => {
                    const res = await fetch(
                      `/api/dashboard/invites/${invite.id}/accept`,
                      {
                        method: "POST",
                      }
                    );
                    if (res.ok) {
                      setInvites((prev) =>
                        prev.filter((i) => i.id !== invite.id)
                      );
                      alert("Invite accepted!");
                    } else {
                      alert("Error accepting invite");
                    }
                  }}
                >
                  Accept Invite
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
