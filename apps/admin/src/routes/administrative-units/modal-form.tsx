import Select from "antd/es/select";
import Form from "antd/es/form";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";

import { useAssignOfficialModalForm, useOfficials, useAdministrativeUnits } from "./hooks";


export default function AssignOfficialModalForm({
  assignOfficialModalProps,
  assignOfficialFormProps
}: Omit<ReturnType<typeof useAssignOfficialModalForm>, "assignOfficialModalShow">) {

  const { officialsSelectProps } = useOfficials()
  const { administrativeUnitsSelectProps } = useAdministrativeUnits()

  return (
    <Modal
      {...assignOfficialModalProps}
      title="Назначение ответственного"
      width={720}
    >
      <Form
        {...assignOfficialFormProps}
        layout="vertical"
        style={{ marginTop: 24 }}
      >
        <Flex gap={24}>
          <Form.Item
            label="Ответственный"
            name="official_id"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 5 }}
          >
            <Select {...officialsSelectProps}>
              {officialsSelectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Поселение"
            name="administrative_unit_id"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 4 }}
          >
            <Select {...administrativeUnitsSelectProps}>
              {administrativeUnitsSelectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  )
}