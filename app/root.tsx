import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import LogRocket from "logrocket";

import { Toaster } from "react-hot-toast";
import type { MetaFunction, LinksFunction } from "remix";
import tailwindStyles from "./tailwind.css";
import globalStyles from "./styles/global.css";

import Header from "~/components/Header";
import Footer from "~/components/Footer";

import type { Web3ReactHooks } from "@web3-react/core";
import { Web3ReactProvider } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";

import { hooks as metaMaskHooks, metaMask } from "~/connectors/meta-mask";
import DisconnectedWarning from "./components/disconnected-warning";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: globalStyles },
];
export const meta: MetaFunction = () => {
  return { title: "Tender.Finance" };
};

if (process.env.NODE_ENV === "production")
  LogRocket.init("6bquwn/tender-frontend");

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, metaMaskHooks]];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="m"></div>
        <Toaster />
        <Web3ReactProvider connectors={connectors}>
          <DisconnectedWarning />
          <Header />
          <Outlet />
        </Web3ReactProvider>
        <Footer />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
