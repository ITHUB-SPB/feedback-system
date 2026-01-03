import { createFileRoute } from "@tanstack/react-router";

import Space from "antd/es/space";
import Button from "antd/es/button";

import { List } from "@/components/layouts";
import AdministrativeUnitsTable from "./table";
import AssignOfficialModalForm from "./modal-form";
import { useAssignOfficialModalForm } from "./hooks";

export const Route = createFileRoute("/_authenticated/administrative_units/")({
  component: ListAdministrativeUnits,
});

function ListAdministrativeUnits() {
  const {
    assignOfficialModalShow,
    assignOfficialModalProps,
    assignOfficialFormProps,
  } = useAssignOfficialModalForm();

  return (
    <>
      <List
        title="Поселения"
        headerButtons={({ defaultButtons }) => (
          <Space>
            {defaultButtons}
            <Button
              onClick={() => {
                assignOfficialModalShow();
              }}
              color="geekblue"
            >
              Назначить ответственного
            </Button>
          </Space>
        )}
      >
        <AdministrativeUnitsTable />
      </List>

      <AssignOfficialModalForm
        assignOfficialModalProps={assignOfficialModalProps}
        assignOfficialFormProps={assignOfficialFormProps}
      />
    </>
  );
}
