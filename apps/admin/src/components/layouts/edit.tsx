import React from "react";
import { useRouter } from "@tanstack/react-router";
import { useMutationMode } from "@refinedev/core";

import Card from 'antd/es/card'
import Space from 'antd/es/space'
import Spin from 'antd/es/spin'

import {
    DeleteButton,
    SaveButton,
    type DeleteButtonProps,
    type SaveButtonProps,
} from "../buttons";
import { PageHeader } from "../pageHeader";
import type { EditProps } from "./types";

export const Edit: React.FC<EditProps> = ({
    children,
    title,
    recordItemId,
    canDelete,
    resource,
    isLoading = false,
    mutationMode: mutationModeProp,
    dataProviderName,
    headerButtons,
    footerButtons,
    deleteButtonProps: deleteButtonPropsFromProps,
    saveButtonProps: saveButtonPropsFromProps,
}) => {
    const router = useRouter();

    const { mutationMode: mutationModeContext } = useMutationMode();
    const mutationMode = mutationModeProp ?? mutationModeContext;

    const deleteButtonProps: DeleteButtonProps | undefined = {
        ...(isLoading ? { disabled: true } : {}),
        resource,
        mutationMode,
        onSuccess: () => {
            router.navigate({ to: `/${resource}` })
        },
        recordItemId,
        dataProviderName,
        ...deleteButtonPropsFromProps,
    };

    const saveButtonProps: SaveButtonProps = {
        ...(isLoading ? { disabled: true } : {}),
        ...saveButtonPropsFromProps,
    };

    const defaultFooterButtons = (
        <>
            {canDelete && <DeleteButton {...deleteButtonProps} />}
            <SaveButton {...saveButtonProps} />
        </>
    );

    return (
        <PageHeader
            onBack={() => {
                router.history.back();
            }}
            title={title ?? "Редактирование"}
            extra={<Space>{headerButtons ?? null}</Space>}
        >
            <Spin spinning={isLoading}>
                <Card
                    variant="borderless"
                    actions={[
                        <Space
                            key="footer-buttons"
                            wrap
                            style={{
                                float: "right",
                                marginRight: 24,
                            }}
                        >
                            {footerButtons ?? defaultFooterButtons}
                        </Space>,
                    ]}
                >
                    {children}
                </Card>
            </Spin>
        </PageHeader>
    );
};
