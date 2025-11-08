import { theme as antdTheme, ConfigProvider } from "antd";
import type { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { darkColorTheme } from "./theme/dark";
import { lightColorTheme } from "./theme/light";

export const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
	const { defaultAlgorithm, darkAlgorithm } = antdTheme;

	// Default to light mode for SSR and initial render
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

		// set initial preference
		setIsDarkMode(mq.matches);

		// listen for changes
		mq.addEventListener("change", handleChange);
		return () => {
			mq.removeEventListener("change", handleChange);
		};
	}, []);

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
