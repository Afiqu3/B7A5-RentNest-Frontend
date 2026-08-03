"use client";
"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var react_1 = require("motion/react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var banner_home_svg_1 = require("@/public/images/banner-home.svg");
var container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
};
var item = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 18 }
    }
};
var STATS = [
    { value: "12k+", label: "Active listings" },
    { value: "8k+", label: "Happy renters" },
    { value: "4.9", label: "Avg. rating" },
];
function Banner() {
    return (React.createElement("section", { className: "relative isolate overflow-hidden bg-background" },
        React.createElement("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10" },
            React.createElement("div", { className: "absolute -top-24 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" }),
            React.createElement("div", { className: "absolute -right-16 top-24 size-72 rounded-full bg-amber-500/10 blur-3xl" }),
            React.createElement("div", { className: "absolute bottom-0 left-1/3 size-72 rounded-full bg-primary/5 blur-3xl" })),
        React.createElement(react_1.motion.div, { variants: container, initial: "hidden", animate: "show", className: "mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28" },
            React.createElement("div", { className: "flex flex-col items-center text-center lg:items-start lg:text-left" },
                React.createElement(react_1.motion.span, { variants: item, className: "inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur" },
                    React.createElement(lucide_react_1.Sparkles, { className: "size-4 text-primary" }),
                    "Find & List Rental Properties with Ease"),
                React.createElement(react_1.motion.h1, { variants: item, className: "mt-6 font-heading text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl" },
                    "Rent smarter with",
                    " ",
                    React.createElement("span", { className: "relative whitespace-nowrap text-primary" },
                        "RentNest",
                        React.createElement("svg", { "aria-hidden": true, viewBox: "0 0 300 12", className: "absolute -bottom-2 left-0 h-2.5 w-full text-amber-500/70", preserveAspectRatio: "none" },
                            React.createElement("path", { d: "M2 9 C 80 2, 220 2, 298 8", stroke: "currentColor", strokeWidth: "4", fill: "none", strokeLinecap: "round" })))),
                React.createElement(react_1.motion.p, { variants: item, className: "mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg" }, "Browse verified rentals, book viewings, and sign securely \u2014 all in one place. Whether you\u2019re looking to rent or list your property, RentNest makes it effortless."),
                React.createElement(react_1.motion.div, { variants: item, className: "mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center" },
                    React.createElement(button_1.Button, { asChild: true, size: "lg", className: "group w-full sm:w-auto" },
                        React.createElement(link_1["default"], { href: "/register" },
                            "Create your free account",
                            React.createElement(lucide_react_1.ArrowRight, { className: "transition-transform duration-300 group-hover:translate-x-1" }))),
                    React.createElement(button_1.Button, { asChild: true, variant: "outline", size: "lg", className: "w-full sm:w-auto" },
                        React.createElement(link_1["default"], { href: "/properties" },
                            React.createElement(lucide_react_1.Search, null),
                            "Browse properties"))),
                React.createElement(react_1.motion.dl, { variants: item, className: "mt-12 grid w-full max-w-md grid-cols-3 gap-4 border-t border-border/70 pt-8 lg:max-w-none" }, STATS.map(function (stat) { return (React.createElement("div", { key: stat.label, className: "text-center lg:text-left" },
                    React.createElement("dt", { className: "font-heading text-2xl font-bold text-foreground sm:text-3xl" }, stat.value),
                    React.createElement("dd", { className: "mt-1 text-xs text-muted-foreground sm:text-sm" }, stat.label))); }))),
            React.createElement(react_1.motion.div, { variants: item, className: "relative mx-auto w-full max-w-lg lg:max-w-none" },
                React.createElement(react_1.motion.div, { animate: { y: [0, -14, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }, className: "relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-amber-100/60 to-muted/40 shadow-xl ring-1 ring-black/5 dark:from-primary/10 dark:to-muted/20" },
                    React.createElement(image_1["default"], { src: banner_home_svg_1["default"], alt: "Cozy rental homes at golden hour", width: 1200, height: 900, priority: true, loading: "eager", className: "h-auto w-full" })),
                React.createElement(react_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.6, type: "spring", stiffness: 200, damping: 16 }, className: "absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur sm:-left-6" },
                    React.createElement("span", { className: "flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary" },
                        React.createElement(lucide_react_1.ShieldCheck, { className: "size-5" })),
                    React.createElement("div", { className: "pr-1 text-left" },
                        React.createElement("p", { className: "text-sm font-semibold text-foreground" }, "Verified listings"),
                        React.createElement("p", { className: "text-xs text-muted-foreground" }, "Every home is checked"))),
                React.createElement(react_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.8, type: "spring", stiffness: 200, damping: 16 }, className: "absolute -right-2 top-8 flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-3 py-2 shadow-lg backdrop-blur sm:-right-4" },
                    React.createElement(lucide_react_1.Star, { className: "size-4 fill-amber-500 text-amber-500" }),
                    React.createElement("span", { className: "text-sm font-semibold text-foreground" }, "4.9"),
                    React.createElement("span", { className: "text-xs text-muted-foreground" }, "/ 5.0"))))));
}
exports["default"] = Banner;
