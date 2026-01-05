import Select from "antd/es/select";
import Form from "antd/es/form";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";

import { useAdministrativeUnits } from "@/hooks/use-administrative-units";
import useOfficials from "@/hooks/use-officials";
import { type UseOfficialAssignFormReturnType } from "@/hooks/use-official-assign-form";

export default function OfficialAssignModalForm({
  officialAssignModalProps,
  officialAssignFormProps,
}: Omit<UseOfficialAssignFormReturnType, "officialAssignModalShow">) {
  const officials = useOfficials();
  const administrativeUnits = useAdministrativeUnits({
    filter: "administrative_unit_type.title[eq]town",
  });

  return (
    <Modal
      {...officialAssignModalProps}
      title="Назначение ответственного"
      width={720}
    >
      <Form
        {...officialAssignFormProps}
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
            <Select {...officials.selectProps}>
              {officials.selectProps?.options?.map((option) => (
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
            <Select
              {...administrativeUnits.selectProps}
              loading={administrativeUnits.isLoading}
            >
              {administrativeUnits.selectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
}
