"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrgDashboardPage() {
  const { orgId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/org/${orgId}/dashboard`);
      if (res.ok) {
        const json = await res.json();
        console.log("HERE THE JSON IS: ", json);
        setData(json);
      }
      setLoading(false);
    }

    if (orgId) {
      fetchData();
    }
  }, [orgId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading data.</div>;

  const isAdminOrOwner = data?.role === "admin" || data?.role === "owner";

  console.log(isAdminOrOwner);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{data.organization.name}</h1>
      <p className="text-muted-foreground mb-6">
        {data.organization.description}
      </p>

      {isAdminOrOwner && (
        <div className="mb-6 space-y-4">
          <Button onClick={() => router.push(`/org/${orgId}/add-service`)}>
            + Add Service
          </Button>

          {/* Invite Form */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Invite a User</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = form.email.value;
                const role = form.role || "member";

                const res = await fetch(`/api/org/${orgId}/invite`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, role }),
                });

                if (res.ok) {
                  alert("Invite sent!");
                  form.reset();
                } else {
                  const err = await res.json();
                  alert(`Error: ${err.error}`);
                }
              }}
              className="space-y-2"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter user's email"
                className="p-2 border rounded w-full"
              />
              <select
                name="role"
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <Button type="submit">Send Invite</Button>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-2">Services</h2>
      <ul className="space-y-2">
        {data.services.map((service: any) => (
          <li
            key={service.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-1"
          >
            <div className="text-lg font-medium">{service.name}</div>
            {service.description && (
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            )}
            {service.url && (
              <p className="text-sm">
                <span className="font-semibold">URL:</span>{" "}
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {service.url}
                </a>
              </p>
            )}
            {service.status && (
              <p className="text-sm">
                <span className="font-semibold">Status:</span> {service.status}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
