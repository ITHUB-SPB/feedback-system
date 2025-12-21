
import Space from "antd/es/space";
import Button from "antd/es/button";

import { List } from "../../components/crud/list";
import OfficialsTable from "./officials-table";
import CreateOfficialModalForm from "./create-official";
import { useCreateOfficial } from './hooks'

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
