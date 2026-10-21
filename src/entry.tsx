import type { ThemeRuntime } from "@yaakdoc/react/theme";
import { contentComponents, Layout } from "@/components/layout";
import { MethodBadge } from "@/components/parts";

const theme: ThemeRuntime = {
  Layout,
  components: { MethodBadge, ...contentComponents },
};

export default theme;
