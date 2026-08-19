import { getSettings } from "@/lib/data";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const s = await getSettings();
  const levels = s.referralLevels as { level1: number; level2: number; level3: number; level4: number };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Settings</h1>
      <SettingsForm
        initial={{
          opayName: s.opayName,
          opayNumber: s.opayNumber,
          minDeposit: s.minDeposit,
          minWithdrawal: s.minWithdrawal,
          level1: levels.level1,
          level2: levels.level2,
          level3: levels.level3,
          level4: levels.level4,
        }}
      />
    </div>
  );
}
