const state = {
	touching : false,
	audioContext: null,
	paused: true,
	haveOpening:false,
	current: 0,
};
const wrap = {
	inner: state
};
export function getState(){
	return wrap.inner;
}
window.state = state;