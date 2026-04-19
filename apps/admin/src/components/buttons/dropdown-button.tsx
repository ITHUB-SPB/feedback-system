import React, { useState, type MouseEventHandler } from "react";

import { WarningOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Space from 'antd/es/space'
import type { MenuProps } from "antd/es/menu";
import type { ItemType } from "antd/es/menu/interface";
import Dropdown, { type DropdownProps } from "antd/es/dropdown/dropdown";
import Button, { type ButtonProps } from "antd/es/button";
import Input from "antd/es/input";

type HandleConfirmProp = {
  handleConfirm: (
    event: MouseEventHandler<HTMLButtonElement>,
    { feedback_status_comment }: { feedback_status_comment: string },
  ) => void;
};

export const DropdownButton: React.FC<
  ButtonProps & HandleConfirmProp
> = ({ children, color, variant, title, handleConfirm }) => {
  const [comment, setComment] = useState("");
  const [dropdownSelected, setDropdownSelected] = useState(false);

  const items: (ItemType & { label: string })[] = [
    {
      key: `Не относится к территории, благоустроенной в рамках государственной 
          программы «Формирование городской среды и обеспечение качественным жильем 
          граждан на территории Ленинградской области» от 14.11.2013`,
      label: `Не относится к выбранной территории`,
    },
    {
      key: 'В предложении не соблюдены этические нормы общения',
      label: 'Не соблюдены этические нормы',
    },
    {
      key: 'Предложение описано недостаточно подробно, либо общими фразами',
      label: 'Недостаточно подробное описание',
    },
  ];

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleConfirm(event, { feedback_status_comment: comment })
  };

  const menuProps: MenuProps = {
    items,
    onClick: (e) => {
      setComment(e.key)
    },
  };

  const objectStyles: DropdownProps['styles'] = {
    root: {
      backgroundColor: '#fff',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
    },
    item: {
      padding: '8px 12px',
    },
    itemTitle: {
      fontWeight: '500',
    },
    itemContent: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <Space>
      <Space.Compact block>
        <Dropdown menu={menuProps} styles={objectStyles}>
          <Button
            variant="outlined"
            danger
            icon={<ArrowDownOutlined />}
            iconPlacement="end"
          >
            Отклонить
          </Button>
        </Dropdown>
        <Input
          placeholder="Свой вариант"
          variant="outlined"
          style={{
            width: 300, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', borderColor: "red", borderLeftWidth: 0
          }}
          value={
            items?.find(item => item?.key === comment)?.label || comment
          }
          onChange={e => setComment(e.target.value)}
        />
        <Button
          disabled={!comment?.length}
          onClick={handleButtonClick}
          icon={<WarningOutlined />}
          iconPlacement="end"
          danger
        >
        </Button>
      </Space.Compact>
    </Space >
  )
};
