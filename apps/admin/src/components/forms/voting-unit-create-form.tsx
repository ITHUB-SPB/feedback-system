import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";

import { type UseModalFormReturnType } from "@/core/refine-antd";
import type { VotingUnitContract } from "@/types";
import useVotingRegions from "../hooks/use-voting-regions";

type VotingUnitCreateFormProps = {
  modalProps: UseModalFormReturnType<
    VotingUnitContract["create"]
  >["modalProps"];
  formProps: UseModalFormReturnType<VotingUnitContract["create"]>["formProps"];
};

export default function VotingUnitCreateForm({
  modalProps,
  formProps,
}: VotingUnitCreateFormProps) {
  const votingRegions = useVotingRegions();

  return (
    <Modal {...modalProps} title="Добавление поселения">
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

          <Form.Item
            label="Район"
            name="voting_region_id"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Select {...votingRegions.selectProps}>
              {votingRegions.selectProps?.options?.map((option) => (
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
