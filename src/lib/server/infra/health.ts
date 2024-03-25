let isLbShutdown: boolean = false;

export const initLbShutdown = () => {
	isLbShutdown = false;
};

export const setLbShutdown = (val: boolean) => {
	isLbShutdown = val;
};

export const getLbShutdown = () => {
	return isLbShutdown;
};
