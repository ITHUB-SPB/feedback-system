import type { UseModalFormReturnType } from "@refinedev/antd";

export type UserRecord = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  role: "official" | "moderator";
  created_at?: string | null;
  email: string;
  name: string;
  phone: string | null;
  social: string | null;
};

export type NewUserRecord = Omit<UserRecord, "name" | "id" | "created_at">;

export type CreateOfficialModalFormProps = {
  createOfficialModalProps: UseModalFormReturnType<UserRecord>["modalProps"];
  createOfficialFormProps: UseModalFormReturnType<UserRecord>["formProps"];
};
