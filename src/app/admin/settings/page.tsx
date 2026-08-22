"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-10">Loading settings...</div>;
  if (!settings) return <div className="text-center py-10 text-red-500">Failed to load settings</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            value={settings.siteName || ""}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        {/* ===== OPay Details ===== */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-[#0a2e1c] mb-3">💳 OPay Payment Details</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                value={settings.opayName || ""}
                onChange={(e) => setSettings({ ...settings, opayName: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={settings.opayNumber || ""}
                onChange={(e) => setSettings({ ...settings, opayNumber: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* ===== SadaPay Details ===== */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-[#0a2e1c] mb-3">💳 SadaPay Payment Details</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                value={settings.sadapayName || ""}
                onChange={(e) => setSettings({ ...settings, sadapayName: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={settings.sadapayNumber || ""}
                onChange={(e) => setSettings({ ...settings, sadapayNumber: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* ===== Minimum Withdrawal ===== */}
        <div className="border-t pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Deposit (PKR)</label>
              <input
                type="number"
                value={settings.minDeposit || 290}
                onChange={(e) => setSettings({ ...settings, minDeposit: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Withdrawal (PKR)</label>
              <input
                type="number"
                value={settings.minWithdrawal || 29}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* ===== Referral Levels ===== */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-[#0a2e1c] mb-3">Referral Commission (%)</h3>
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 1</label>
              <input
                type="number"
                value={settings.referralLevels?.level1 || 11}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    referralLevels: { ...settings.referralLevels, level1: Number(e.target.value) },
                  })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 2</label>
              <input
                type="number"
                value={settings.referralLevels?.level2 || 3}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    referralLevels: { ...settings.referralLevels, level2: Number(e.target.value) },
                  })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 3</label>
              <input
                type="number"
                value={settings.referralLevels?.level3 || 2}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    referralLevels: { ...settings.referralLevels, level3: Number(e.target.value) },
                  })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 4</label>
              <input
                type="number"
                value={settings.referralLevels?.level4 || 1}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    referralLevels: { ...settings.referralLevels, level4: Number(e.target.value) },
                  })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#ffd700] py-3 font-bold text-[#0a2e1c] transition hover:bg-[#e6c200] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
