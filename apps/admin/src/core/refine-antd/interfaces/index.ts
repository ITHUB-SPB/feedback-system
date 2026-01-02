export type BaseRecord = {
  id?: string;
  [key: string]: any;
};

export interface Option {
  label: string;
  value: string;
}

export type FieldProps<T> = {
  value: T;
};

export interface UploadedFile {
  uid: string;
  name: string;
  url: string;
  type: string;
  size: number;
  percent: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
}
