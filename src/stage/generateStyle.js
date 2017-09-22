import { dropTypes } from './scene/drops/config';
import {imageURL} from '../utils/loadImageBlob';
function ran() {
	return Math.floor(Math.random() * 15 - 5);
}

function getAnimation(x) {
	const arr = ['0% {  transform: translate(0%, 0%) scale(1) }'];
	for (let i = 2; i <= 10; i += 2) {
		arr.push(`${i * 10}% { transform: translate(${ran()}px,${ran()}px) }`);
	}
	let str = arr.join('\n');
	return `@keyframes waterFlow${x}{\n ${str} \n }`;
}

export function generateStyle() {
	const styleSheet = document.createElement('style');
	let i = 0;
	const arr = [];
	while (i < 32) {
		arr.push(`.anim_${i}:before {opacity: 1; transform: translate(0,0) skew(0,0); animation: waterFlow${i} ${( 5 + Math.random() * 5 + 0.5)}s ${(Math.random() + 0.5)}s linear infinite alternate; }`);
		arr.push(getAnimation(i));
		i++;
	}
	styleSheet.innerHTML = arr.join('\n');
	document.head.appendChild(styleSheet);
	addDropStyles();
}

function addDropStyles() {
	const styleSheet = document.createElement('style');
	styleSheet.innerHTML = dropTypes.map(function (type, i) {
		//type = 'bigdrop' + Math.floor(Math.random() * 2.999);
		const imgUrl = imageURL(`/images/stage/drops/${type}.png`);
		return `.drop${i}:before { background-image: url("${imgUrl}")}\n.drop${i}:after{ background-image: url("${imgUrl}")}`;
	}).join('\n');
	document.head.appendChild(styleSheet);
}