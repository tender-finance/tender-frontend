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

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

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
function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc, connector) {
  return new Web3Provider(provider);
}

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
        <Web3ReactProvider getLibrary={getLibrary}>
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
