import { createFileRoute } from '@tanstack/react-router'
import Space from "antd/es/space";
import Button from "antd/es/button";

import { List } from "../../../components/crud/list";
import OfficialsTable from "./_officials-table";
import CreateOfficialModalForm from "./_create-official";
import { useCreateOfficial } from './_hooks'


export const Route = createFileRoute('/_authenticated/officials/')({
  component: ListOfficials,
})

export default function ListOfficials() {
  const { createOfficialFormProps, createOfficialModalProps, createOfficialModalShow } = useCreateOfficial()

  return (
    <>
      <List
        title="Администрация"
        createButtonProps={{
          hidden: true,
        }}
        headerButtons={() => (
          <Space>
            <Button
              onClick={() => {
                createOfficialModalShow();
              }}
              type="primary"
            >
              Создать
            </Button>
          </Space>
        )}
      >
        <OfficialsTable />
      </List>
      <CreateOfficialModalForm createOfficialFormProps={createOfficialFormProps} createOfficialModalProps={createOfficialModalProps} />
    </>
  );
};
