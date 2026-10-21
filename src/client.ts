import { builtinIslands } from "@yaakdoc/react/islands";
import {
  CopyCode,
  CopyText,
  EnvironmentMenu,
  MobileNavToggle,
  PageActions,
  RunInYaakButton,
  ThemeToggle,
} from "@/components/islands";

export default [
  ...builtinIslands,
  CopyCode,
  CopyText,
  PageActions,
  MobileNavToggle,
  EnvironmentMenu,
  RunInYaakButton,
  ThemeToggle,
];
