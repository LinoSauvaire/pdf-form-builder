export interface FormField {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "text" | "checkbox";
  name: string;
}
