/**
 * ToolType for pixel editing tools
 */
export const ToolType = {
  Pencil: "pencil",
  Eraser: "eraser",
  Fill: "fill",
  Picker: "picker",
} as const;

export type ToolType = (typeof ToolType)[keyof typeof ToolType];

