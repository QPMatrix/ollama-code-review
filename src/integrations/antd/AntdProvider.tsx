import { ConfigProvider } from "antd";
import type { FC, PropsWithChildren } from "react";
import { themeConfig } from "./theme-config";

export const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
	return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};
