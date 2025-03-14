
// Analytics
import ana1 from "@/components/fui/analytics/ana1";
import ana2 from "@/components/fui/analytics/ana2";
import ana3 from "@/components/fui/analytics/ana3";
import ana4 from "@/components/fui/analytics/ana4";
import ana5 from "@/components/fui/analytics/ana5";

// Code
import cod1 from "@/components/fui/code/cod1";
import cod2 from "@/components/fui/code/cod2";
import cod3 from "@/components/fui/code/cod3";

// Metric
import met1 from "@/components/fui/metric/met1";
import met2 from "@/components/fui/metric/met2";
import met3 from "@/components/fui/metric/met3";
import met4 from "@/components/fui/metric/met4";

// Selection
import sel1 from "@/components/fui/selection/sel1";
import sel2 from "@/components/fui/selection/sel2";

// Table
import tab1 from "@/components/fui/table/tab1";
import tab2 from "@/components/fui/table/tab2";

interface DefaultFuiComponentProps {
  [key: string]: any;
}

export const defaultFuiComponentsMap: Record<string, React.FC<DefaultFuiComponentProps>> = {
  ana1,
  ana2,
  ana3,
  ana4,
  ana5,

  cod1,
  cod2,
  cod3,

  met1,
  met2,

  met3,
  met4,

  sel1,
  sel2,

  tab1,
  tab2,
};