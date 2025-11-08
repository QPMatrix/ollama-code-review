import { useCallback, useEffect, useRef } from "react";

export const useIsMounted = () => {
	const isMountedRef = useRef(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const getIsMounted = useCallback(() => isMountedRef.current, []);
	return { getIsMounted };
};
