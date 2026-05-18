export type QuickAction = { label: string; value: string };

export type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  actions?: QuickAction[];
  form?: boolean;
  success?: boolean;
};
