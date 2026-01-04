import { useModalForm } from "@/core/refine-antd";
import type { OfficialResponsibilityContract } from "@/types";

export default function useOfficialAssignForm() {
  const {
    modalProps: officialAssignModalProps,
    formProps: officialAssignFormProps,
    show: officialAssignModalShow,
  } = useModalForm<OfficialResponsibilityContract["create"]>({
    resource: "official_responsibilities",
    action: "create",
    redirect: false,
  });

  return {
    officialAssignModalProps,
    officialAssignFormProps,
    officialAssignModalShow,
  };
}

export type UseOfficialAssignFormReturnType = ReturnType<
  typeof useOfficialAssignForm
>;
