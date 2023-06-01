import React from "react";
import type { AppProps } from "next/app";

export type AppPropsWithLayout = AppProps & {
  Component: { getLayout?: () => React.ReactNode };
};
