import localFont from "next/font/local";

export const supplyMono = localFont({
  src: [
    {
      path: "../assets/fonts/PPSupplyMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/PPSupplyMono-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-supply-mono",
});

export const supplySans = localFont({
  src: [
    {
      path: "../assets/fonts/PPSupplySans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-supply-sans",
});
