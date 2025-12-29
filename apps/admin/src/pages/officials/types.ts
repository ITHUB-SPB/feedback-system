import type { UseModalFormReturnType } from "@refinedev/antd";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: "official" | "moderator";
  created_at?: string | null;
  email: string;
  name: string;
  phone: string | null;
  social: string | null;
  password: string;
};

export type NewUserRecord = Omit<UserRecord, "name" | "id" | "created_at">;

export type CreateOfficialModalFormProps = {
  createOfficialModalProps: UseModalFormReturnType<UserRecord>["modalProps"];
  createOfficialFormProps: UseModalFormReturnType<UserRecord>["formProps"];
};

export type IResponsibility = {
  administrative_unit_id: number;
  official_id: string;
  officialFirstName: string | undefined;
  officialLastName: string | undefined;
  officialMiddleName: string | undefined;
  administrative_unit: string | undefined;
};

export type AdministrativeUnitRecord = {
  id: number;
  title: string;
  unit_type: string;
  unit_type_id: number;
};
