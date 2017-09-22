const state = {
	touching : false,
	audioContext: null,
	paused: true,
};
const wrap = {
	inner: state
};
export function getState(){
	return wrap.inner;
}
window.state = state;