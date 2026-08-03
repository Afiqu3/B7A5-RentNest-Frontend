/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
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
exports.__esModule = true;
exports.createReview = exports.isReviewed = exports.getPaymentUrl = exports.getMyRequests = void 0;
var refreshToken_1 = require("@/service/refreshToken");
exports.getMyRequests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, res, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, refreshToken_1.isAccessTokenExist()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, fetch(process.env.BACKEND_API_URL + "/api/rentals/my-request", {
                        headers: {
                            Cookie: "accessToken=" + accessToken
                        },
                        cache: "no-cache"
                    })];
            case 2:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.getPaymentUrl = function (rentalId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, res, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, refreshToken_1.isAccessTokenExist()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, fetch(process.env.BACKEND_API_URL + "/api/payments/checkout/" + rentalId, {
                        method: "POST",
                        headers: {
                            Cookie: "accessToken=" + accessToken
                        },
                        cache: "no-cache"
                    })];
            case 2:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.isReviewed = function (rentalId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, res, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, refreshToken_1.isAccessTokenExist()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, fetch(process.env.BACKEND_API_URL + "/api/reviews/" + rentalId + "/exists", {
                        headers: {
                            Cookie: "accessToken=" + accessToken
                        },
                        cache: "no-cache"
                    })];
            case 2:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result.data];
        }
    });
}); };
exports.createReview = function (prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var rentalRequestId, payload, accessToken, res, result;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                void prevState;
                rentalRequestId = (_a = formData.get("rentalRequestId")) === null || _a === void 0 ? void 0 : _a.toString();
                if (!rentalRequestId) {
                    return [2 /*return*/, {
                            success: false,
                            statusCode: 400,
                            message: "A rental request is required.",
                            data: {}
                        }];
                }
                payload = {
                    rating: Number(formData.get("rating")),
                    comment: String(formData.get("comment") || "")
                };
                return [4 /*yield*/, refreshToken_1.isAccessTokenExist()];
            case 1:
                accessToken = _e.sent();
                return [4 /*yield*/, fetch(process.env.BACKEND_API_URL + "/api/reviews/" + rentalRequestId, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: "accessToken=" + accessToken
                        },
                        body: JSON.stringify(payload)
                    })];
            case 2:
                res = _e.sent();
                return [4 /*yield*/, res.json()["catch"](function () { return ({}); })];
            case 3:
                result = _e.sent();
                return [2 /*return*/, {
                        success: Boolean(result === null || result === void 0 ? void 0 : result.success),
                        statusCode: (_b = result === null || result === void 0 ? void 0 : result.statusCode) !== null && _b !== void 0 ? _b : res.status,
                        message: (_c = result === null || result === void 0 ? void 0 : result.message) !== null && _c !== void 0 ? _c : "Unable to submit your review right now.",
                        data: (_d = result === null || result === void 0 ? void 0 : result.data) !== null && _d !== void 0 ? _d : {}
                    }];
        }
    });
}); };
