"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Organization, Invite } from "@/types";
import { Logo } from "@/components/Logo";

interface InviteWithOrg extends Invite {
  organization?: {
    name: string;
  };
}

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<InviteWithOrg[]>([]);

  // Function to fetch organizations
  const fetchOrgs = async () => {
    try {
      const res = await fetch("/api/auth/sync", { method: "POST" });
      const data = await res.json();
      setOrgs(data.orgs || []);
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Failed to fetch organizations");
    }
  };

  // Function to fetch invites
  const fetchInvites = async () => {
    try {
      const res = await fetch("/api/dashboard/invites");
      if (res.ok) {
        const json = await res.json();
        setInvites(json);
      }
    } catch (error) {
      console.error("Failed to fetch invites:", error);
      toast.error("Failed to fetch invites");
    }
  };

  useEffect(() => {
    let mounted = true;

    if (isSignedIn && user) {
      const initializeData = async () => {
        try {
          if (mounted) {
            await fetchOrgs();
            await fetchInvites();
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      initializeData();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [isSignedIn, user]);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/dashboard/invites/${inviteId}/accept`, {
        method: "POST",
      });

      if (res.ok) {
        // Remove the accepted invite from the invites list
        setInvites((prev) => prev.filter((i) => i.id !== inviteId));
        // Fetch updated organizations list
        await fetchOrgs();
        toast.success("Invite accepted successfully!");
      } else {
        toast.error("Failed to accept invite");
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast.error("An error occurred while accepting the invite");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-6">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-center">
          Service Status Made Simple
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-xl mb-8">
          Monitor, manage, and communicate service status to your users with
          ease.
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <SignOutButton>
            <Button variant="outline">Logout</Button>
          </SignOutButton>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Organizations</h2>
            <Link href="/org/create">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                Create Organization
              </Button>
            </Link>
          </div>

          {orgs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No organizations yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first organization to get started
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {orgs.map((org) => (
                <li
                  key={org.id}
                  className="p-6 rounded-xl border shadow-sm hover:shadow-md transition"
                >
                  <div className="font-medium text-xl mb-2">{org.name}</div>
                  {org.description && (
                    <p className="text-gray-600 mb-4 text-sm">
                      {org.description}
                    </p>
                  )}
                  <Link href={`org/${org.id}`}>
                    <Button className="w-full" size="sm">
                      View Dashboard
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {invites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Pending Invites</h2>
            <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {invites.map((invite: InviteWithOrg) => (
                <li
                  key={invite.id}
                  className="p-6 bg-yellow-50 rounded-xl border border-yellow-100 space-y-3"
                >
                  <p>
                    <span className="font-semibold">Organization:</span>{" "}
                    {invite.organization?.name || invite.orgId}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span>{" "}
                    <span className="capitalize">{invite.role}</span>
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => handleAcceptInvite(invite.id)}
                  >
                    Accept Invite
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
