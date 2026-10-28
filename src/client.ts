import { builtinIslands } from "@yaakdoc/react/islands";
import {
  CopyCode,
  CopyText,
  EnvironmentMenu,
  MobileNavToggle,
  PageActions,
  RunInYaakButton,
  SearchButton,
  SearchWindow,
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
  SearchButton,
  SearchWindow,
];
