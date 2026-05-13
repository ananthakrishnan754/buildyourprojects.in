export default async function handler(req, res) {
  // Decommissioned: Payment orders are now securely processed directly via UroPay UI embedded integration.
  res.status(200).json({ decommissioned: true, provider: "UroPay" });
}
