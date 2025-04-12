"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const roles = ["owner", "admin", "member", "viewer"];

export default function AddServicePage() {
  const router = useRouter();
  const { orgId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    status: "operational",
    rolesAllowed: [] as string[],
  });

  const handleCheckboxChange = (role: string) => {
    setFormData((prev) => {
      const alreadyChecked = prev.rolesAllowed.includes(role);
      return {
        ...prev,
        rolesAllowed: alreadyChecked
          ? prev.rolesAllowed.filter((r) => r !== role)
          : [...prev.rolesAllowed, role],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/org/${orgId}/services`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Service created!");
      router.push(`/org/${orgId}`);
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Service Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Visible to Roles</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {roles.map((role) => (
              <div key={role} className="flex items-center gap-2">
                <Checkbox
                  id={role}
                  checked={formData.rolesAllowed.includes(role)}
                  onCheckedChange={() => handleCheckboxChange(role)}
                />
                <Label htmlFor={role} className="capitalize">
                  {role}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Service
        </Button>
      </form>
    </div>
  );
}
