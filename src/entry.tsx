import type { ThemeRuntime } from "@yaakdoc/react/theme";
import { contentComponents, Layout } from "@/components/layout";
import { NavIcon } from "@/components/page";
import { MethodBadge } from "@/components/parts";

const theme: ThemeRuntime = {
  Layout,
  components: { MethodBadge, NavIcon, ...contentComponents },
};

export default theme;
