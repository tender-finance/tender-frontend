import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import { Toaster } from "react-hot-toast";
import type { MetaFunction, LinksFunction } from "remix";
import tailwindStyles from "./tailwind.css";
import globalStyles from "./styles/global.css";

import Header from "~/components/Header";
import Footer from "~/components/Footer";

import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import { hooks as metaMaskHooks, metaMask } from "~/connectors/meta-mask";

import type {
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: globalStyles },
];
export const meta: MetaFunction = () => {
  return { title: "Tender.Finance" };
};

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
