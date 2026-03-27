export type EventApplication = {
  id: number;
  status: "pending" | "confirmed" | "canceled";
  applied_at: string;
  canceled_at: string | null;
  event: {
    id: number;
    title: string;
    starts_at: string;
    location: string;
  };
};
