import { expect, it, describe } from "vitest";
import { defaults } from "./defaults";
import {
  Un,
  UnInterceptorManager,
  UnCanceledError,
  UnCancelToken,
  isUnCancel,
  UnError,
  isUnError,
  HttpStatusCode,
} from "./core";
import { mergeConfig } from "./utils";
import { un } from ".";
import { version } from "../package.json";

describe("index", () => {
  it("un should be defined", () => {
    expect(un).toBeDefined();
  });
  it("un should be a function", () => {
    expect(un).toSatisfy((fn) => typeof fn === "function");
  });
  it("un should have specific properties", () => {
    expect(un).toHaveProperty("defaults");
    expect(un).toHaveProperty("interceptors");
    expect(un).toHaveProperty("request");
    expect(un).toHaveProperty("download");
    expect(un).toHaveProperty("upload");
    expect(un).toHaveProperty("get");
    expect(un).toHaveProperty("delete");
    expect(un).toHaveProperty("head");
    expect(un).toHaveProperty("options");
    expect(un).toHaveProperty("trace");
    expect(un).toHaveProperty("connect");
    expect(un).toHaveProperty("post");
    expect(un).toHaveProperty("put");
    expect(un).toHaveProperty("patch");
    expect(un).toHaveProperty("getUri");
    expect(un).toHaveProperty("create");
    expect(un).toHaveProperty("Un");
    expect(un).toHaveProperty("CanceledError");
    expect(un).toHaveProperty("CancelToken");
    expect(un).toHaveProperty("isCancel");
    expect(un).toHaveProperty("VERSION");
    expect(un).toHaveProperty("UnError");
    expect(un).toHaveProperty("isUnError");
    expect(un).toHaveProperty("all");
    expect(un).toHaveProperty("mergeConfig");
    expect(un).toHaveProperty("HttpStatusCode");
  });
  it("un properties expectation", () => {
    expect(un.defaults).toBe(defaults);
    expect(un.interceptors.request).toBeInstanceOf(UnInterceptorManager);
    expect(un.interceptors.response).toBeInstanceOf(UnInterceptorManager);
    expect(un.request).toBeInstanceOf(Function);
    expect(un.download).toBeInstanceOf(Function);
    expect(un.upload).toBeInstanceOf(Function);
    expect(un.get).toBeInstanceOf(Function);
    expect(un.delete).toBeInstanceOf(Function);
    expect(un.head).toBeInstanceOf(Function);
    expect(un.options).toBeInstanceOf(Function);
    expect(un.trace).toBeInstanceOf(Function);
    expect(un.connect).toBeInstanceOf(Function);
    expect(un.post).toBeInstanceOf(Function);
    expect(un.put).toBeInstanceOf(Function);
    expect(un.patch).toBeInstanceOf(Function);
    expect(un.getUri).toBeInstanceOf(Function);
    expect(un.create).toBeInstanceOf(Function);
    expect(un.Un).toBe(Un);
    expect(un.CanceledError).toBe(UnCanceledError);
    expect(un.CancelToken).toBe(UnCancelToken);
    expect(un.isCancel).toBe(isUnCancel);
    expect(un.VERSION).toBe(version);
    expect(un.UnError).toBe(UnError);
    expect(un.isUnError).toBe(isUnError);
    expect(un.mergeConfig).toBe(mergeConfig);
    expect(un.HttpStatusCode).toBe(HttpStatusCode);
  });
});
