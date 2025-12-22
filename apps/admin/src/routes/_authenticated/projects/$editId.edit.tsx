import { createFileRoute } from '@tanstack/react-router'

import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import InputNumber from "antd/es/input-number";
import Flex from 'antd/es/flex'

import { useForm, useSelect } from "@refinedev/antd";

import { Edit } from "../../../components/crud/edit";


export const Route = createFileRoute('/_authenticated/projects/$editId/edit')({
  component: EditProject,
})

function EditProject() {
  const { editId } = Route.useParams()

  const { formProps, saveButtonProps, query: projectQuery } = useForm({
    resource: "projects",
    id: editId,
    redirect: "show",
  });

  const record = projectQuery?.data?.data;

  const { selectProps: administrativeUnitProps } = useSelect({
    resource: "administrative_units",
    defaultValue: record?.administrative_unit_id,
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Название" name="title">
          <Input />
        </Form.Item>
        <Flex gap="5%">
          <Form.Item label="Территория" name="administrative_unit_id" style={{ flex: 1 }}>
            <Select {...administrativeUnitProps} />
          </Form.Item>
          <Form.Item label="Год реализации" name="year_of_completion">
            <InputNumber step="1" min={2010} max={2026} />
          </Form.Item>
        </Flex>
        <Flex gap="5%">
          <Form.Item label="Широта" name="latitude" style={{ flex: 1 }}>
            <InputNumber pattern="\d*\.\d*" step={0.001} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Долгота" name="longitude" style={{ flex: 1 }}>
            <InputNumber pattern="\d*\.\d*" step={0.001} style={{ width: "100%" }} />
          </Form.Item>
        </Flex>
      </Form>
    </Edit>
  );
}
