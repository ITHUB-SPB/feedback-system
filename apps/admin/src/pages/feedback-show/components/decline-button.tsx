import React, { useState, type MouseEventHandler } from "react";

import { DeleteOutlined } from "@ant-design/icons";
import Button, { type ButtonProps } from "antd/es/button";
import Input from "antd/es/input";
import Popconfirm, { type PopconfirmProps } from "antd/es/popconfirm";

import { RefineButtonClassNames } from "@/core/refine-types";

type HandleConfirmProp = {
    handleConfirm: (
        event: MouseEventHandler<HTMLButtonElement>,
        { feedback_status_comment }: { feedback_status_comment: string | null },
    ) => void;
};

export const DeclineButton: React.FC<
    ButtonProps & PopconfirmProps & HandleConfirmProp
> = ({ children, color, variant, title, handleConfirm }) => {
    const [comment, setComment] = useState("");

    return (
        <Popconfirm
            key="delete"
            okText="Подтвердить"
            cancelText="Отменить"
            okType="primary"
            title={title}
            icon={null}
            description={
                <Input.TextArea
                    rows={4}
                    style={{ resize: "none", width: "100%" }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            }
            okButtonProps={{ disabled: comment.length < 3 }}
            onConfirm={(event: any) =>
                handleConfirm(event, { feedback_status_comment: comment })
            }
        >
            <Button
                color={color}
                variant={variant}
                // loading={loading}
                icon={<DeleteOutlined />}
                className={RefineButtonClassNames.DeleteButton}
            >
                {children}
            </Button>
        </Popconfirm>
    );
};
