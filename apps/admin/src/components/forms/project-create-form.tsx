import Input from "antd/es/input";
import Select from "antd/es/select";
import InputNumber from "antd/es/input-number";
import Flex from "antd/es/flex";
import Form from "antd/es/form";

import { useAdministrativeUnits } from "../hooks/use-administrative-units";

export default function CreateProjectForm() {
  const { isLoading, selectProps } = useAdministrativeUnits();

  return (
    <>
      <Form.Item label="Название" name="title">
        <Input minLength={2} />
      </Form.Item>
      <Flex gap="5%">
        <Form.Item
          label="Территория"
          name="administrative_unit_id"
          style={{ flex: 1 }}
        >
          <Select {...selectProps} loading={isLoading} />
        </Form.Item>
        <Form.Item label="Год реализации" name="year_of_completion">
          <InputNumber step="1" min={2010} max={2026} />
        </Form.Item>
      </Flex>
      <Flex gap="5%">
        <Form.Item label="Широта" name="latitude" style={{ flex: 1 }}>
          <InputNumber
            pattern="\d*\.\d*"
            step={0.001}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Долгота" name="longitude" style={{ flex: 1 }}>
          <InputNumber
            pattern="\d*\.\d*"
            step={0.001}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Flex>
    </>
  );
}
