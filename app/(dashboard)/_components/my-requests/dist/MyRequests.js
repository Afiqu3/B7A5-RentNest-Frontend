"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var React = require("react");
var react_1 = require("motion/react");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var myRequestActions_1 = require("../../_actions/myRequestActions");
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0
    }).format(Number(value));
}
function formatDate(value) {
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(new Date(value));
}
function formatStatus(status) {
    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, function (char) { return char.toUpperCase(); });
}
function getStatusStyles(status) {
    switch (status) {
        case "PENDING":
            return "border-amber-500/30 bg-amber-500/10 text-amber-700";
        case "APPROVED":
            return "border-sky-500/30 bg-sky-500/10 text-sky-700";
        case "REJECTED":
            return "border-rose-500/30 bg-rose-500/10 text-rose-700";
        case "ACTIVE":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
        case "COMPLETED":
            return "border-slate-500/30 bg-slate-500/10 text-slate-700";
        default:
            return "border-muted bg-muted text-muted-foreground";
    }
}
var MyRequests = function (_a) {
    var requests = _a.requests;
    var _b = React.useState(false), reviewOpen = _b[0], setReviewOpen = _b[1];
    var _c = React.useState(null), selectedRequest = _c[0], setSelectedRequest = _c[1];
    var _d = React.useState([]), reviewedIds = _d[0], setReviewedIds = _d[1];
    var _e = React.useState("5"), rating = _e[0], setRating = _e[1];
    var _f = React.useState(""), comment = _f[0], setComment = _f[1];
    var _g = React.useState(false), submitting = _g[0], setSubmitting = _g[1];
    var handlePayNow = function (rentalId) { return __awaiter(void 0, void 0, void 0, function () {
        var result, url, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, myRequestActions_1.getPaymentUrl(rentalId)];
                case 1:
                    result = _b.sent();
                    url = result.data.transactionResult;
                    if (url) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    sonner_1.toast.error("Unable to open payment link right now.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOpenReview = function (request) { return __awaiter(void 0, void 0, void 0, function () {
        var reviewed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setSelectedRequest(request);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, myRequestActions_1.isReviewed(request.id)];
                case 2:
                    reviewed = _b.sent();
                    if (reviewed) {
                        setReviewedIds(function (current) { return __spreadArrays(current, [request.id]); });
                        sonner_1.toast.info("You have already reviewed this request.");
                        setReviewOpen(false);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setReviewOpen(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSubmitReview = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event.preventDefault();
                    if (!selectedRequest)
                        return [2 /*return*/];
                    setSubmitting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    formData = new FormData();
                    formData.set("rating", rating);
                    formData.set("comment", comment);
                    formData.set("rentalRequestId", selectedRequest.id);
                    return [4 /*yield*/, myRequestActions_1.createReview({ success: false, statusCode: 0, message: "", data: {} }, formData)];
                case 2:
                    result = _b.sent();
                    if (result === null || result === void 0 ? void 0 : result.success) {
                        sonner_1.toast.success("Review submitted successfully.");
                        setReviewedIds(function (current) { return __spreadArrays(current, [selectedRequest.id]); });
                        setReviewOpen(false);
                        setComment("");
                        setRating("5");
                    }
                    else {
                        sonner_1.toast.error((result === null || result === void 0 ? void 0 : result.message) || "Could not submit your review.");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    sonner_1.toast.error("Unable to submit your review right now.");
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(react_1.motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" }, className: "space-y-6" },
        React.createElement("div", { className: "rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6" },
            React.createElement("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary" },
                        React.createElement(lucide_react_1.ReceiptText, { className: "size-4" }),
                        "My rental requests"),
                    React.createElement("div", null,
                        React.createElement("h1", { className: "font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" }, "Your rental journey at a glance"),
                        React.createElement("p", { className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base" }, "Track statuses, pay approved requests, and leave a review once a rental is completed."))),
                React.createElement("div", { className: "rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground" },
                    React.createElement("div", { className: "flex items-center gap-2 font-medium text-foreground" },
                        React.createElement(lucide_react_1.Sparkles, { className: "size-4 text-primary" }),
                        requests.length,
                        " requests"),
                    React.createElement("p", { className: "mt-1" }, "Everything you need in one place")))),
        requests.length === 0 ? (React.createElement("div", { className: "flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center" },
            React.createElement("div", { className: "flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground" },
                React.createElement(lucide_react_1.Wallet, { className: "size-6" })),
            React.createElement("h2", { className: "mt-5 font-heading text-xl font-semibold text-foreground" }, "No rental requests yet"),
            React.createElement("p", { className: "mt-2 max-w-md text-sm leading-6 text-muted-foreground" }, "Your submitted requests will appear here once they are created."))) : (React.createElement("div", { className: "grid gap-4 xl:grid-cols-2" }, requests.map(function (request, index) {
            var isReviewedRequest = reviewedIds.includes(request.id);
            return (React.createElement(react_1.motion.article, { key: request.id, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.04, duration: 0.25 }, className: "rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm" },
                React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium " + getStatusStyles(request.status) },
                            React.createElement(lucide_react_1.BadgeCheck, { className: "size-3.5" }),
                            formatStatus(request.status)),
                        React.createElement("h2", { className: "mt-3 font-heading text-lg font-semibold text-foreground" }, request.property.title),
                        React.createElement("p", { className: "mt-1 text-sm leading-6 text-muted-foreground" },
                            request.property.location,
                            " \u2022 ",
                            request.property.address)),
                    React.createElement("div", { className: "rounded-2xl bg-primary/10 p-3 text-primary" },
                        React.createElement(lucide_react_1.Wallet, { className: "size-5" }))),
                React.createElement("div", { className: "mt-5 grid gap-3 sm:grid-cols-2" },
                    React.createElement("div", { className: "rounded-2xl border border-border/60 bg-background/70 p-4" },
                        React.createElement("p", { className: "text-sm text-muted-foreground" }, "Rent amount"),
                        React.createElement("p", { className: "mt-1 font-heading text-xl font-semibold text-foreground" }, formatCurrency(request.property.rentAmount))),
                    React.createElement("div", { className: "rounded-2xl border border-border/60 bg-background/70 p-4" },
                        React.createElement("p", { className: "text-sm text-muted-foreground" }, "Duration"),
                        React.createElement("p", { className: "mt-1 font-heading text-xl font-semibold text-foreground" },
                            request.durationMonths,
                            " month",
                            request.durationMonths > 1 ? "s" : ""))),
                React.createElement("div", { className: "mt-4 grid gap-3 md:grid-cols-2" },
                    React.createElement("div", { className: "rounded-2xl border border-border/60 bg-background/70 p-4" },
                        React.createElement("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground" },
                            React.createElement(lucide_react_1.CalendarDays, { className: "size-4 text-primary" }),
                            "Move-in date"),
                        React.createElement("p", { className: "mt-2 text-sm text-muted-foreground" }, formatDate(request.moveInDate))),
                    React.createElement("div", { className: "rounded-2xl border border-border/60 bg-background/70 p-4" },
                        React.createElement("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground" },
                            React.createElement(lucide_react_1.Clock3, { className: "size-4 text-primary" }),
                            "End date"),
                        React.createElement("p", { className: "mt-2 text-sm text-muted-foreground" }, formatDate(request.endDate)))),
                React.createElement("div", { className: "mt-5 flex flex-wrap gap-2" },
                    request.status === "APPROVED" && (React.createElement(button_1.Button, { onClick: function () { return handlePayNow(request.id); }, className: "gap-2" },
                        React.createElement(lucide_react_1.CreditCard, { className: "size-4" }),
                        "Pay now")),
                    request.status === "COMPLETED" && !isReviewedRequest && (React.createElement(button_1.Button, { variant: "outline", onClick: function () { return handleOpenReview(request); }, className: "gap-2 cursor-pointer" },
                        React.createElement(lucide_react_1.MessageSquarePlus, { className: "size-4" }),
                        "Review")))));
        }))),
        React.createElement(dialog_1.Dialog, { open: reviewOpen, onOpenChange: setReviewOpen },
            React.createElement(dialog_1.DialogContent, { className: "sm:max-w-md" },
                React.createElement(dialog_1.DialogHeader, null,
                    React.createElement(dialog_1.DialogTitle, null, "Leave a review"),
                    React.createElement(dialog_1.DialogDescription, null, "Share your experience for this completed rental.")),
                React.createElement("form", { onSubmit: handleSubmitReview, className: "space-y-4" },
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement("label", { className: "text-sm font-medium text-foreground" }, "Rating"),
                        React.createElement(input_1.Input, { type: "number", min: "1", max: "5", value: rating, onChange: function (event) { return setRating(event.target.value); } })),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement("label", { className: "text-sm font-medium text-foreground" }, "Comment"),
                        React.createElement("textarea", { value: comment, onChange: function (event) { return setComment(event.target.value); }, className: "min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:border-primary", placeholder: "Tell others about your stay" })),
                    React.createElement(dialog_1.DialogFooter, null,
                        React.createElement(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setReviewOpen(false); } }, "Cancel"),
                        React.createElement(button_1.Button, { type: "submit", disabled: submitting }, submitting ? "Submitting..." : "Submit review")))))));
};
exports["default"] = MyRequests;
