"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Settings {
  id: string;
  siteName: string;
  siteLogo: string | null;
  opayName: string;
  opayNumber: string;
  sadapayName: string;
  sadapayNumber: string;
  minDeposit: string;
  minWithdrawal: string;
  referralLevels: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
  };
}

const DEFAULT_SETTINGS: Settings = {
  id: "",
  siteName: "AlBarkah Invest",
  siteLogo: null,
  opayName: "Muhammad Shahzad Pervaiz",
  opayNumber: "03320613270",
  sadapayName: "Muhammad Shahzad Pervaiz",
  sadapayNumber: "03320613270",
  minDeposit: "290",
  minWithdrawal: "29",
  referralLevels: { level1: 11, level2: 3, level3: 2, level4: 1 },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to load settings. Using defaults.");
      setSettings(DEFAULT_SETTINGS);
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

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const updateReferralLevel = (level: keyof Settings["referralLevels"], value: number) => {
    setSettings({
      ...settings,
      referralLevels: { ...settings.referralLevels, [level]: value },
    });
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-2xl mb-2">⚙️</div>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

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
            onChange={(e) => updateSetting("siteName", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
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
                onChange={(e) => updateSetting("opayName", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={settings.opayNumber || ""}
                onChange={(e) => updateSetting("opayNumber", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
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
                onChange={(e) => updateSetting("sadapayName", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={settings.sadapayNumber || ""}
                onChange={(e) => updateSetting("sadapayNumber", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
          </div>
        </div>

        {/* ===== Minimum Deposit & Withdrawal ===== */}
        <div className="border-t pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Deposit (PKR)</label>
              <input
                type="number"
                value={settings.minDeposit || 290}
                onChange={(e) => updateSetting("minDeposit", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Withdrawal (PKR)</label>
              <input
                type="number"
                value={settings.minWithdrawal || 29}
                onChange={(e) => updateSetting("minWithdrawal", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
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
                onChange={(e) => updateReferralLevel("level1", Number(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 2</label>
              <input
                type="number"
                value={settings.referralLevels?.level2 || 3}
                onChange={(e) => updateReferralLevel("level2", Number(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 3</label>
              <input
                type="number"
                value={settings.referralLevels?.level3 || 2}
                onChange={(e) => updateReferralLevel("level3", Number(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level 4</label>
              <input
                type="number"
                value={settings.referralLevels?.level4 || 1}
                onChange={(e) => updateReferralLevel("level4", Number(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]"
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
