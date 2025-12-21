import { useShow } from "@refinedev/core";

import { TextField } from "../../components/fields/text";
import { NumberField } from "../../components/fields/number";
import { Show } from "../../components/crud/show";

import Typography from "antd/es/typography";


const ShowProject = () => {
  const {
    result: project,
    query: { isLoading },
  } = useShow();

  return (
    <Show isLoading={isLoading} title="Информация о проекте">
      <Typography.Title level={5}>Название</Typography.Title>
      <TextField value={project?.title} />

      <Typography.Title level={5}>Территория</Typography.Title>
      <TextField value={project?.administrative_unit} />

      <Typography.Title level={5}>Год реализации</Typography.Title>
      <TextField value={project?.year_of_completion} />

      <Typography.Title level={5}>Широта</Typography.Title>
      <NumberField value={project?.latitude} />

      <Typography.Title level={5}>Долгота</Typography.Title>
      <NumberField value={project?.longitude} />
    </Show>
  );
};

export default ShowProject;
