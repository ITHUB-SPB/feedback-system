import Form from "antd/es/form";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";

import { type UseModalFormReturnType } from "@/core/refine-antd";
import type { VotingUnitContract } from "@/types";

type VotingRegionCreateFormProps = {
  modalProps: UseModalFormReturnType<
    VotingUnitContract["create"]
  >["modalProps"];
  formProps: UseModalFormReturnType<VotingUnitContract["create"]>["formProps"];
};

export default function VotingRegionCreateForm({
  modalProps,
  formProps,
}: VotingRegionCreateFormProps) {
  return (
    <Modal {...modalProps} title="Добавление района">
      <Form {...formProps} layout="vertical" style={{ marginTop: 24 }}>
        <Flex gap={16}>
          <Form.Item
            label="Название"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
}
