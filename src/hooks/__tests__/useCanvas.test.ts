import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCanvas } from "../useCanvas";

describe("useCanvas hook", () => {
  it("should initialize with default scale", () => {
    const { result } = renderHook(() => useCanvas());

    expect(result.current.scale).toBe(1.0);
    expect(result.current.offsetX).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it("should initialize with custom scale", () => {
    const { result } = renderHook(() => useCanvas(2.0));

    expect(result.current.scale).toBe(2.0);
  });

  it("should zoom in", () => {
    const { result } = renderHook(() => useCanvas(1.0));

    act(() => {
      result.current.zoomIn();
    });

    expect(result.current.scale).toBeGreaterThan(1.0);
  });

  it("should zoom out", () => {
    const { result } = renderHook(() => useCanvas(2.0));

    act(() => {
      result.current.zoomOut();
    });

    expect(result.current.scale).toBeLessThan(2.0);
  });

  it("should pan", () => {
    const { result } = renderHook(() => useCanvas());

    act(() => {
      result.current.pan(10, 20);
    });

    expect(result.current.offsetX).toBe(10);
    expect(result.current.offsetY).toBe(20);
  });

  it("should reset view", () => {
    const { result } = renderHook(() => useCanvas(2.0));

    act(() => {
      result.current.pan(100, 200);
      result.current.zoomIn();
    });

    act(() => {
      result.current.resetView();
    });

    expect(result.current.scale).toBe(1.0);
    expect(result.current.offsetX).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it("should clamp zoom to min scale", () => {
    const { result } = renderHook(() => useCanvas(0.3));

    act(() => {
      result.current.setZoom(0.1); // Below min
    });

    expect(result.current.scale).toBeGreaterThanOrEqual(0.25);
  });

  it("should clamp zoom to max scale", () => {
    const { result } = renderHook(() => useCanvas(1.0));

    act(() => {
      result.current.setZoom(5.0); // Above max
    });

    expect(result.current.scale).toBeLessThanOrEqual(4.0);
  });
});

