// Embedded in each scene: selectors stay inside that composition's runtime scope.
const vars = window.__hyperframes.getVariables();
const cues = JSON.parse(vars.cues || "{}");
const T = (name, fallback) => cues[name] ?? fallback;
// The chapter's level colour, for headings.
document.querySelector("#root").style.setProperty("--level", vars.tone || "#4c9bff");
const tl = gsap.timeline({ paused: true });
const enter = (selector, at, x = 0) => tl.fromTo(selector,
	{ opacity: 0, x, y: x ? 0 : 22 },
	{ opacity: 1, x: 0, y: 0, duration: 0.55, ease: "power3.out" }, at);
const leave = (selector, at) => tl.to(selector, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" }, at);
const emphasis = (selector, at) => tl.fromTo(selector,
	{ scale: 1 }, { scale: 1.035, duration: 0.22, repeat: 1, yoyo: true, ease: "sine.inOut" }, at);
const meter = (selector, value, at) => tl.fromTo(selector,
	{ scaleX: 0 }, { scaleX: value, duration: 0.8, ease: "power2.out" }, at);
const count = (selector, value, at, from = 0) => {
	const state = { value: from };
	const node = document.querySelector(selector);
	tl.fromTo(state, { value: from }, { value, duration: 0.8, ease: "power2.out",
		onUpdate: () => { node.textContent = `${state.value < -0.5 ? '−' : ''}$${Math.abs(Math.round(state.value)).toLocaleString('en-US')}`; }
	}, at);
};
const flow = (id, at) => {
	const root = document.querySelector(id);
	const path = root.querySelector(".fp-path");
	const label = root.querySelector(".fp-flow-label");
	if (label) tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 1.15);
	const packet = root.querySelector(".fp-packet");
	const length = path.getTotalLength();
	const position = { progress: 0 };
	tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at);
	tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length },
		{ strokeDashoffset: 0, duration: 0.65, ease: "power2.inOut" }, at);
	// The amount travels once, then rests at the midpoint as the persistent Allocation label.
	tl.fromTo(position, { progress: 0 }, { progress: 1, duration: 1.1, ease: "power2.inOut",
		onUpdate: () => {
			const point = path.getPointAtLength(length * Math.min(0.5, position.progress));
			const pulse = path.getPointAtLength(length * position.progress);
			gsap.set(root.querySelector(".fp-pulse"), { attr: { cx: pulse.x, cy: pulse.y }, opacity: Math.sin(position.progress * Math.PI) });
			gsap.set(packet, { x: point.x, y: point.y, xPercent: -50, yPercent: -50 });
		}
	}, at + 0.12);
	tl.fromTo(root.querySelector(".fp-arrow"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.5);
};
const steps = (selector, times) => {
	const items = document.querySelector(selector).querySelectorAll(".fp-step");
	items.forEach((item, index) => {
		enter(item, times[0]);
		tl.to(item, { color: "#fafafa", duration: 0.3 }, times[index]);
		if (index + 1 < times.length) tl.to(item, { color: "#a1a1aa", duration: 0.3 }, times[index + 1]);
	});
};
// Draws an amount-free arrow along its path.
const draw = (id, at) => {
	const root = document.querySelector(id);
	const path = root.querySelector(".fp-path");
	const length = path.getTotalLength();
	tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.15 }, at);
	tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length },
		{ strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, at);
	tl.fromTo(root.querySelector(".fp-arrow"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.45);
};
// Dims an object that stays on screen but stops being the subject.
const dim = (selector, at) => tl.to(selector, { opacity: 0.3, duration: 0.35, ease: "power2.out" }, at);
const undim = (selector, at) => tl.to(selector, { opacity: 1, duration: 0.35, ease: "power2.out" }, at);
