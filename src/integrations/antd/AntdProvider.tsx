import { theme as antdTheme, ConfigProvider } from "antd";
import type { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useIsMounted } from "@/hooks/use-is-mounted/useIsMounted";
import { darkColorTheme } from "./theme/dark";
import { lightColorTheme } from "./theme/light";

export const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
	const { defaultAlgorithm, darkAlgorithm } = antdTheme;
	const { isMounted } = useIsMounted();
	// Default to light mode for SSR and initial render
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// This code runs only in browser, after mount
		if (!isMounted()) return;

		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const applyTheme = () => {
			if (mq.matches) {
				setIsDarkMode(true);
			} else {
				setIsDarkMode(false);
			}
		};

		applyTheme();
		mq.addEventListener("change", applyTheme);
		return () => mq.removeEventListener("change", applyTheme);
	}, [isMounted]);

	return (
		<ConfigProvider
			theme={{
				algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
				token: isDarkMode ? darkColorTheme : lightColorTheme,
			}}
		>
			{children}
		</ConfigProvider>
	);
};
