import { createFileRoute } from "@tanstack/react-router";
import Button from "antd/es/button";

import { PageHeader } from "@/components/page-header";
import { useCreateForm } from "@/components/forms/use-create-form";
import { useModal } from "@/components/use-modal";

import OfficialCreateModalForm from "@/forms/official-create-form";
import OfficialsTable from "@/tables/officials-table";

import { orpcClient } from "@/providers/orpc-client";
import { queryClient } from "@/providers/data-provider";
import { useNotificationProvider } from "@/providers/notification-provider";

import type { NewOfficialRecord, Official } from "@/types";

export const Route = createFileRoute("/_authenticated/officials")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.officialResponsibility.all.queryOptions({
        input: {},
      }),
    );

    context.orpcClient.administrativeUnit.all.queryOptions({
      input: {
        filter: "administrative_unit_type.title[eq]town",
      },
    });
  },
  component: OfficialsPage,
});

function OfficialsPage() {
  const notification = useNotificationProvider();
  const mutationOptions = orpcClient.official.create.mutationOptions();

  const { form, formProps, saveButtonProps, onFinish } = useCreateForm<
    Official,
    Error,
    NewOfficialRecord,
    Official,
    Official,
    Error
  >({
    mutationOptions,
    onMutationSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["official", "all"]],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "default", "officials"],
        refetchType: "all",
      });
      notification.open({
        type: "success",
        message: "Аккаунт успешно создан",
      });
    },
    onMutationError: (error: unknown) => {
      notification.open({
        type: "error",
        message: (error as Error)?.message ?? "Ошибка при создании аккаунта",
      });
    },
    defaultFormValues: {
      role: "official",
      middleName: "",
    },
  });

  const { show, close, modalProps } = useModal();

  return (
    <>
      <PageHeader
        title="Администрация"
        extra={
          <Button
            onClick={() => {
              show();
            }}
            type="primary"
          >
            Создать
          </Button>
        }
      >
        <OfficialsTable />
      </PageHeader>
      <OfficialCreateModalForm
        officialCreateFormProps={{
          form,
          onValuesChange: formProps?.onValuesChange,
          onKeyUp: formProps?.onKeyUp,
          onFinish: async (values: NewOfficialRecord) => {
            onFinish(values);
            close();
            form.resetFields();
          },
        }}
        officialCreateModalProps={{
          open: modalProps.visible || modalProps.open || false,
          width: "1000px",
          okButtonProps: saveButtonProps,
          okText: "Сохранить",
          cancelText: "Отменить",
          onCancel: close,
        }}
      />
    </>
  );
}
