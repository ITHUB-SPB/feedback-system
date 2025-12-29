export type PersonRecord = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
};

export type IResponsibility = {
  administrative_unit_id: number;
  official_id: string;
  officialFirstName: string | undefined;
  officialLastName: string | undefined;
  officialMiddleName: string | undefined;
};

export type AdministrativeUnitRecord = {
  id: number;
  title: string;
  unit_type: string;
  unit_type_id: number;
};
