import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useRef, useEffect } from "react";
import "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import { createHead } from "@unhead/vue/server";
import { defineComponent, ref, onMounted, createSSRApp } from "vue";
import { Sparkles, Plus, X, ChartNoAxesGantt, ChevronDown as ChevronDown$1, Menu, ChevronUp as ChevronUp$1, Zap, ArrowRight, SmilePlus, MessageSquareText, View, Check, MessageSquare, Activity, Award, Eye, TrendingUp, Target, FileText, BarChart3, RefreshCw, CheckCircle2, Search, Link2, Share2, Briefcase, Video, Brain, BookOpen, Heart, Users, Download, Shield, Lightbulb } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App2, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1() {
    const app = createSSRApp(App2);
    let head;
    if (useHead) {
      app.use(head = createHead());
    }
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router: void 0,
      routes: void 0,
      initialState: {},
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      transformState
    };
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    await (fn == null ? void 0 : fn(context));
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref2) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      className: cn(buttonVariants({ variant, size, className })),
      ref: ref2,
      ...props
    }
  );
});
Button.displayName = "Button";
const Card = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "div",
  {
    ref: ref2,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "div",
  {
    ref: ref2,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref: ref2,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "p",
  {
    ref: ref2,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx("div", { ref: ref2, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "div",
  {
    ref: ref2,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(({ className, type, ...props }, ref2) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref: ref2,
      ...props
    }
  );
});
Input.displayName = "Input";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref2) => /* @__PURE__ */ jsx(
  "div",
  {
    ref: ref2,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref: ref2,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref2) => /* @__PURE__ */ jsx(
  "div",
  {
    ref: ref2,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
function QueryCustomizer({ onQueriesChange, onKeywordsChange }) {
  const [customQueries, setCustomQueries] = useState([]);
  const [customKeywords, setCustomKeywords] = useState([]);
  const [queryInput, setQueryInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const addQuery = () => {
    if (queryInput.trim()) {
      const newQueries = [...customQueries, queryInput.trim()];
      setCustomQueries(newQueries);
      onQueriesChange == null ? void 0 : onQueriesChange(newQueries);
      setQueryInput("");
    }
  };
  const removeQuery = (index) => {
    const newQueries = customQueries.filter((_, i) => i !== index);
    setCustomQueries(newQueries);
    onQueriesChange == null ? void 0 : onQueriesChange(newQueries.length > 0 ? newQueries : null);
  };
  const addKeyword = () => {
    if (keywordInput.trim()) {
      const keywordsToAdd = keywordInput.split(",").map((k) => k.trim()).filter((k) => k.length > 0);
      const newKeywords = [...customKeywords, ...keywordsToAdd];
      setCustomKeywords(newKeywords);
      onKeywordsChange == null ? void 0 : onKeywordsChange(newKeywords);
      setKeywordInput("");
    }
  };
  const removeKeyword = (index) => {
    const newKeywords = customKeywords.filter((_, i) => i !== index);
    setCustomKeywords(newKeywords);
    onKeywordsChange == null ? void 0 : onKeywordsChange(newKeywords.length > 0 ? newKeywords : null);
  };
  const useDefaults = () => {
    setCustomQueries([]);
    setCustomKeywords([]);
    onQueriesChange == null ? void 0 : onQueriesChange(null);
    onKeywordsChange == null ? void 0 : onKeywordsChange(null);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }),
          "Customize Analysis"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Add your own questions or keywords for deeper insights" })
      ] }),
      (customQueries.length > 0 || customKeywords.length > 0) && /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: useDefaults, children: "Use Defaults" })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Custom Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Ask specific questions about the brand" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "e.g., How secure is this product?",
              value: queryInput,
              onChange: (e) => setQueryInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addQuery();
                }
              }
            }
          ),
          /* @__PURE__ */ jsx(Button, { onClick: addQuery, type: "button", size: "sm", children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) })
        ] }),
        customQueries.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: customQueries.map((query, index) => /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "secondary",
            className: "flex items-center gap-1 py-1 px-3",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: query }),
              /* @__PURE__ */ jsx(
                X,
                {
                  className: "h-3 w-3 cursor-pointer hover:text-destructive",
                  onClick: () => removeQuery(index)
                }
              )
            ]
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Keywords/Topics" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Auto-generates 2 questions per keyword" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "e.g., security, pricing, support (comma-separated)",
              value: keywordInput,
              onChange: (e) => setKeywordInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }
            }
          ),
          /* @__PURE__ */ jsx(Button, { onClick: addKeyword, type: "button", size: "sm", children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) })
        ] }),
        customKeywords.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: customKeywords.map((keyword, index) => /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "outline",
            className: "flex items-center gap-1 py-1 px-3",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: keyword }),
              /* @__PURE__ */ jsx(
                X,
                {
                  className: "h-3 w-3 cursor-pointer hover:text-destructive",
                  onClick: () => removeKeyword(index)
                }
              )
            ]
          },
          index
        )) })
      ] }),
      (customQueries.length > 0 || customKeywords.length > 0) && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground bg-muted p-3 rounded-md", children: [
        "📊 Will analyze ",
        /* @__PURE__ */ jsx("strong", { children: customQueries.length + customKeywords.length * 2 }),
        " custom queries",
        customQueries.length === 0 && " + 5 default queries"
      ] })
    ] })
  ] });
}
function Navigation({ currentPage = "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultingDropdownOpen, setConsultingDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [mobileConsultingOpen, setMobileConsultingOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const isActive = (page) => currentPage === page;
  return /* @__PURE__ */ jsxs("header", { className: "max-w-[90%] mx-auto rounded-xl bg-white/90 backdrop-blur-sm sticky top-8 z-[100] shadow-sm relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto px-6 lg:px-8 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-8 px-4", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative",
            onMouseEnter: () => setConsultingDropdownOpen(true),
            onMouseLeave: () => setConsultingDropdownOpen(false),
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: `text-sm font-medium transition-colors flex items-center gap-1 ${isActive("geo") || isActive("seo") || isActive("ppc") ? "text-blue-600" : "text-slate-900 hover:text-blue-600"}`,
                  children: [
                    "Consulting",
                    /* @__PURE__ */ jsx(ChevronDown$1, { className: "h-4 w-4" })
                  ]
                }
              ),
              consultingDropdownOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[332px] z-[150]", children: /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-lg shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/geo",
                    onClick: () => setConsultingDropdownOpen(false),
                    className: "block px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0",
                    children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900 mb-1", children: "GEO" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Generative Engine Optimization for AI platforms" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/seo",
                    onClick: () => setConsultingDropdownOpen(false),
                    className: "block px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0",
                    children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900 mb-1", children: "SEO" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Search Engine Optimization that feeds AI visibility" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/ppc",
                    onClick: () => setConsultingDropdownOpen(false),
                    className: "block px-6 py-4 hover:bg-slate-50 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900 mb-1", children: "PPC" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Paid advertising strategies for maximum ROI" })
                    ]
                  }
                )
              ] }) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative",
            onMouseEnter: () => setPlatformDropdownOpen(true),
            onMouseLeave: () => setPlatformDropdownOpen(false),
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: `text-sm font-medium transition-colors flex items-center gap-1 ${isActive("tool") ? "text-blue-600" : "text-slate-900 hover:text-blue-600"}`,
                  children: [
                    "Platform",
                    /* @__PURE__ */ jsx(ChevronDown$1, { className: "h-4 w-4" })
                  ]
                }
              ),
              platformDropdownOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[332px] z-[150]", children: /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-lg shadow-xl", children: /* @__PURE__ */ jsx("div", { className: "py-2", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/tool",
                  onClick: () => setPlatformDropdownOpen(false),
                  className: "block px-6 py-4 hover:bg-slate-50 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900 mb-1", children: "Tool" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Track and measure your AI visibility" })
                  ]
                }
              ) }) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/insights",
            className: `text-sm font-medium transition-colors ${isActive("insights") ? "text-blue-600" : "text-slate-900 hover:text-blue-600"}`,
            children: "Insights"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/how-we-work",
            className: `text-sm font-medium transition-colors ${isActive("how-we-work") ? "text-blue-600" : "text-slate-900 hover:text-blue-600"}`,
            children: "How We Work"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/about",
            className: `text-sm font-medium transition-colors ${isActive("about") ? "text-blue-600" : "text-slate-900 hover:text-blue-600"}`,
            children: "About"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileMenuOpen(!mobileMenuOpen),
          className: "md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      )
    ] }),
    mobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden border-t border-gray-200 bg-white backdrop-blur-sm", children: /* @__PURE__ */ jsxs("nav", { className: "px-6 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          onClick: () => setMobileMenuOpen(false),
          className: `text-base font-medium transition-colors py-2 ${isActive("home") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMobileConsultingOpen(!mobileConsultingOpen),
            className: `w-full flex items-center justify-between text-base font-medium transition-colors py-2 ${isActive("geo") || isActive("seo") || isActive("ppc") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
            children: [
              "Consulting",
              mobileConsultingOpen ? /* @__PURE__ */ jsx(ChevronUp$1, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(ChevronDown$1, { className: "h-5 w-5" })
            ]
          }
        ),
        mobileConsultingOpen && /* @__PURE__ */ jsxs("div", { className: "pl-4 mt-2 space-y-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/geo",
              onClick: () => setMobileMenuOpen(false),
              className: `block text-sm transition-colors py-2 ${isActive("geo") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`,
              children: "GEO - Generative Engine Optimization"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/seo",
              onClick: () => setMobileMenuOpen(false),
              className: `block text-sm transition-colors py-2 ${isActive("seo") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`,
              children: "SEO - Search Engine Optimization"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/ppc",
              onClick: () => setMobileMenuOpen(false),
              className: `block text-sm transition-colors py-2 ${isActive("ppc") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`,
              children: "PPC - Pay-Per-Click Advertising"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMobilePlatformOpen(!mobilePlatformOpen),
            className: `w-full flex items-center justify-between text-base font-medium transition-colors py-2 ${isActive("tool") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
            children: [
              "Platform",
              mobilePlatformOpen ? /* @__PURE__ */ jsx(ChevronUp$1, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(ChevronDown$1, { className: "h-5 w-5" })
            ]
          }
        ),
        mobilePlatformOpen && /* @__PURE__ */ jsx("div", { className: "pl-4 mt-2 space-y-2", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/tool",
            onClick: () => setMobileMenuOpen(false),
            className: `block text-sm transition-colors py-2 ${isActive("tool") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`,
            children: "Tool - AI Visibility Tracking"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/insights",
          onClick: () => setMobileMenuOpen(false),
          className: `text-base font-medium transition-colors py-2 ${isActive("insights") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
          children: "Insights"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/how-we-work",
          onClick: () => setMobileMenuOpen(false),
          className: `text-base font-medium transition-colors py-2 ${isActive("how-we-work") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
          children: "How We Work"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/about",
          onClick: () => setMobileMenuOpen(false),
          className: `text-base font-medium transition-colors py-2 ${isActive("about") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`,
          children: "About"
        }
      )
    ] }) })
  ] });
}
function ComingSoon() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [customQueries, setCustomQueries] = useState(null);
  const [customKeywords, setCustomKeywords] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const videoRef = useRef(null);
  const mainSectionRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  useEffect(() => {
    if (videoRef.current) {
      if (loading) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [loading]);
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!brandUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    let formattedUrl = brandUrl.trim();
    if (!formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = "https://" + formattedUrl;
      setBrandUrl(formattedUrl);
    }
    setError("");
    setStep(2);
  };
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const apiUrl = "https://your-backend.up.railway.app";
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          brand_url: brandUrl,
          email,
          custom_queries: customQueries,
          custom_keywords: customKeywords
        })
      });
      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }
      const data = await response.json();
      setPreview(data.preview);
      setStep(3);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setStep(1);
    setBrandUrl("");
    setEmail("");
    setCustomQueries(null);
    setCustomKeywords(null);
    setPreview(null);
    setError("");
  };
  const scrollToForm = () => {
    var _a;
    (_a = mainSectionRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      var _a2;
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }, 500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "VISIBI - Track Your Brand in AI Conversations | AI Visibility Platform" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Know where your brand appears in AI conversations across ChatGPT, Claude, Gemini, and Perplexity. Get free AI brand visibility analysis and sentiment tracking." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "AI visibility, brand tracking, ChatGPT mentions, AI platform analytics, GEO, generative engine optimization" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "VISIBI - Track Your Brand in AI Conversations" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Know where your brand appears in AI conversations across ChatGPT, Claude, Gemini, and Perplexity. Get free AI brand visibility analysis." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "VISIBI - Track Your Brand in AI Conversations" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Know where your brand appears in AI conversations across ChatGPT, Claude, Gemini, and Perplexity." }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VISIBI",
        "url": "https://visibi.com",
        "logo": "https://visibi.com/logo.png",
        "description": "AI visibility tracking and optimization platform. Track your brand mentions across ChatGPT, Gemini, Perplexity, and Claude.",
        "foundingDate": "2023",
        "sameAs": [
          "https://linkedin.com/company/visibi",
          "https://github.com/visibi"
        ],
        "offers": {
          "@type": "Offer",
          "itemOffered": [
            {
              "@type": "Service",
              "name": "GEO - Generative Engine Optimization",
              "description": "Optimize your brand's visibility across AI platforms like ChatGPT, Gemini, and Perplexity"
            },
            {
              "@type": "Service",
              "name": "AI Visibility Tracking",
              "description": "Track mentions, citations, and sentiment across all major AI platforms"
            },
            {
              "@type": "Service",
              "name": "AI-Ready SEO",
              "description": "Search engine optimization that feeds both Google rankings and AI citations"
            }
          ]
        }
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "home" }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-[90%] mx-auto items-left px-4 lg:px-[5rem] mb-4 mt-12 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-full bg-white/90 border border-slate-300 dark:border-gray-800 left-0 top-2 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200" }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center relative z-10 py-16 top-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-4xl text-left space-y-8 relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/60 dark:bg-blue-900/50 text-orange-700 dark:text-blue-400 text-sm font-medium border border-orange-200", children: [
            /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4" }),
            "Launching soon with exclusive early access"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "inline-block", children: /* @__PURE__ */ jsx("h1", { className: "font-inter text-md text-5xl md:text-7xl font-thin text-slate-950 dark:text-slate-100", children: "Know where your Brand appears in AI Conversations" }) }),
          /* @__PURE__ */ jsx("h2", { className: "md:w-[90%] text-md md:text-xl font-light text-slate-950 tracking-tight dark:text-slate-100 mt-4 md:mt-6 mb-0", children: "Your brand's visibility and reputation across ChatGPT, Claude, Gemini, and Perplexity." }),
          /* @__PURE__ */ jsx("div", { className: "py-0", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: scrollToForm,
              className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-3xl font-medium hover:bg-blue-800 transition-colors",
              children: [
                "Get Visualise",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-w-2xl text-center space-y-8 relative z-10", children: /* @__PURE__ */ jsx("img", { src: "./sample-dash.png", alt: "VISIBI AI visibility dashboard showing brand mentions, citations, and sentiment analysis across ChatGPT, Gemini, and Perplexity", className: "rounded-xl border border-slate-200 pattern-background p-2" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative w-full py-16 mt-16 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 py-0 border-slate-300 border transition-colors pattern-background", children: [
        /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-r border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4  mx-auto py-8", children: [
          /* @__PURE__ */ jsx(SmilePlus, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Sentiment Analysis" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "font-space-mono text-md text-slate-950 dark:text-gray-400", children: "Track how AI models perceive your brand - positive, neutral, or negative" })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-r md:border-l border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
          /* @__PURE__ */ jsx(MessageSquareText, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Mention Tracking" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "font-space-mono text-md text-slate-950 dark:text-gray-400", children: "See how often your brand gets mentioned in AI responses" })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-l border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
          /* @__PURE__ */ jsx(View, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Citation" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "font-space-mono text-md text-slate-950 dark:text-gray-400", children: "Measure your brand's presence across AI platforms" })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("main", { ref: mainSectionRef, className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white dark:bg-gray-950 rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 dark:border-gray-800 mb-32", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 dark:border-gray-800 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 dark:border-gray-800 right-0 top-0 pattern-background rounded-br-xl" }),
      step === 1 && /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs(Card, { className: "max-w-3xl mx-auto border-0 shadow-none bg-white dark:bg-slate-950", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "font-inner text-slate-950 font-normal", children: "Get Your Free Brand Analysis" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Enter your brand URL to get started" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: handleUrlSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 md:flex-row flex-col", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  ref: inputRef,
                  type: "text",
                  placeholder: "www.yourbrand.com or yourbrand.com",
                  value: brandUrl,
                  onChange: (e) => setBrandUrl(e.target.value),
                  className: "flex-1 h-14 px-8 text-md font-space-mono placeholder-blue-500 border-blue-400 bg-slate-200/20 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full",
                  required: true
                }
              ),
              /* @__PURE__ */ jsxs(Button, { type: "submit", size: "xl", className: "h-14 px-8 bg-blue-700 dark:bg-blue-900/50 text-white text-lg font-semibold dark:text-blue-400 rounded-full", children: [
                "Get Visualise",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
              ] })
            ] }),
            error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-400 text-center", children: "Join 100+ brands already monitoring their AI presence" }) })
        ] })
      ] }) }),
      step === 2 && /* @__PURE__ */ jsx("div", { className: "mx-auto space-y-6 max-w-7xl", children: /* @__PURE__ */ jsxs(Card, { className: "bg-white dark:bg-slate-950 border-0 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Customise & Get Early Access" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Add keywords (optional) and enter your email to get your free analysis" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleEmailSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Brand URL" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-green-50 dark:bg-gray-800 rounded-lg", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: brandUrl }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setStep(1),
                  className: "ml-auto",
                  children: "Change"
                }
              )
            ] })
          ] }),
          customQueries && customQueries.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium", children: [
              "Custom Questions (",
              customQueries.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg", children: customQueries.map((query, index) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-sm p-2 bg-white dark:bg-slate-800 rounded border border-purple-200 dark:border-purple-700",
                children: query
              },
              index
            )) })
          ] }),
          customKeywords && customKeywords.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium", children: [
              "Added Keywords (",
              customKeywords.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 p-3 bg-green-50 dark:bg-blue-900/20 rounded-lg", children: customKeywords.map((keyword, index) => /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                className: "bg-white dark:bg-slate-800",
                children: keyword
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => setShowAdvanced(!showAdvanced),
                className: "w-full justify-between text-muted-foreground hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4" }),
                    "Advanced Options (Custom Queries & Keywords)"
                  ] }),
                  showAdvanced ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                ]
              }
            ),
            showAdvanced && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
              QueryCustomizer,
              {
                onQueriesChange: setCustomQueries,
                onKeywordsChange: setCustomKeywords
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email Address" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                placeholder: "you@company.com",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: "h-12 text-lg bg-white dark:bg-slate-950 dark:text-white placeholder-gray-500 border-gray-300 dark:border-slate-700",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "lg",
                className: "flex-1",
                onClick: () => setStep(1),
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxs(Button, { type: "submit", size: "lg", className: "flex-1 h-12 rounded-3xl dark:bg-white-800 dark:text-slate-950", disabled: loading, children: [
              loading ? "Analyzing..." : "Get My Free Analysis",
              !loading && /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
            ] })
          ] }),
          error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) })
        ] }) })
      ] }) }),
      step === 3 && preview && /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-12", children: [
        /* @__PURE__ */ jsx(Card, { className: "bg-white dark:bg-green-950/30 border-0", children: /* @__PURE__ */ jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Check, { className: "h-8 w-8 text-green-600 dark:text-green-400" }) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "You're on the list!" }),
          /* @__PURE__ */ jsxs(CardDescription, { className: "text-base text-gray-700", children: [
            "We'll send your detailed brand analysis report to ",
            /* @__PURE__ */ jsx("strong", { className: "font-semibold text-blue-700 dark:text-gray-100", children: email }),
            " soon."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-inter font-semibold mb-2", children: "Quick Preview" }),
            /* @__PURE__ */ jsxs("p", { className: "text-md text-gray-600 dark:text-gray-400", children: [
              "Here's what we're analysing for ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-700 text-md dark:text-gray-100", children: preview.brand_name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsx(Card, { className: "border-1 shadow-sm bg-gray-100/20 dark:bg-slate-950 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col items-center justify-center py-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-40 h-40 mb-4", children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: "#d2d5db",
                      strokeWidth: "8",
                      fill: "none"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: "#1e293b",
                      strokeWidth: "8",
                      fill: "none",
                      strokeDasharray: `${Math.min(preview.mentions / 100 * 439.8, 439.8)} 439.8`,
                      strokeLinecap: "round",
                      className: "transition-all duration-1000 ease-out"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "text-5xl font-inter font-bold text-gray-700 dark:text-white", children: preview.mentions }) }) })
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-lg font-light font-space-mono text-gray-600 dark:text-gray-400", children: "Total Mentions" })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "border-1 shadow-sm bg-gray-100/20 dark:bg-slate-950 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col items-center justify-center py-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-40 h-40 mb-4", children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: "#e5e7eb",
                      strokeWidth: "8",
                      fill: "none"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: "#1e293b",
                      strokeWidth: "8",
                      fill: "none",
                      strokeDasharray: `${Math.min(preview.citations / 100 * 439.8, 439.8)} 439.8`,
                      strokeLinecap: "round",
                      className: "transition-all duration-1000 ease-out"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "text-5xl font-inter font-bold text-gray-700 dark:text-white", children: preview.citations }) }) })
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-lg font-light font-space-mono text-gray-600 dark:text-gray-400", children: "Citations" })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "border-1 shadow-sm bg-gray-100/20 dark:bg-slate-950 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col items-center justify-center py-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-40 h-40 mb-4", children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: "#e5e7eb",
                      strokeWidth: "8",
                      fill: "none"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: "80",
                      cy: "80",
                      r: "70",
                      stroke: preview.sentiment === "POSITIVE" ? "#10b981" : preview.sentiment === "NEGATIVE" ? "#ef4444" : "#6b7280",
                      strokeWidth: "8",
                      fill: "none",
                      strokeDasharray: `${preview.visibility / 100 * 439.8} 439.8`,
                      strokeLinecap: "round",
                      className: "transition-all duration-1000 ease-out"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: `text-5xl font-inter font-bold ${preview.sentiment === "POSITIVE" ? "text-green-600 dark:text-green-400" : preview.sentiment === "NEGATIVE" ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`, children: Math.round(preview.visibility) }) }) })
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-lg font-light font-space-mono text-gray-600 dark:text-gray-400", children: "Sentiment Score" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Alert, { className: "bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "The full report will include detailed sentiment breakdown, competitive analysis, position tracking, and actionable insights." })
          ] }),
          preview.sample_query && preview.sample_response && /* @__PURE__ */ jsxs(Card, { className: "mt-6 bg-white dark:bg-slate-950 border-2 border-blue-200 dark:border-blue-800", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5 text-blue-600" }),
                "Sample AI Response"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Example of how AI models mention your brand" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2", children: "Question:" }),
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-800 dark:text-gray-200", children: preview.sample_query })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2", children: "AI Response:" }),
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-800 dark:text-gray-200 leading-relaxed", children: preview.sample_response.split(new RegExp(`(${preview.brand_name})`, "gi")).map(
                  (part, index) => part.toLowerCase() === preview.brand_name.toLowerCase() ? /* @__PURE__ */ jsx("mark", { className: "bg-yellow-200 dark:bg-yellow-600 font-semibold px-1 rounded", children: part }, index) : /* @__PURE__ */ jsx("span", { children: part }, index)
                ) })
              ] })
            ] })
          ] }),
          preview.citation_urls && preview.citation_urls.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "mt-4 bg-white dark:bg-slate-950 border-2 border-purple-200 dark:border-purple-800", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5 text-purple-600" }),
                "Query Sources (",
                preview.citation_urls.length,
                ")"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { children: "All queries analyzed for your brand" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: preview.citation_urls.map((citation, index) => /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg border ${citation.mentioned ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `mt-1 ${citation.mentioned ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700" : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"}`, children: index + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-800 dark:text-gray-200 flex-1", children: citation.query }),
                  citation.mentioned && /* @__PURE__ */ jsx(Badge, { className: "bg-green-600 text-white text-xs", children: "Brand Mentioned" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: citation.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: `text-xs hover:underline flex items-center gap-1 ${citation.mentioned ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "View in ChatGPT" }),
                      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
                    ]
                  }
                )
              ] })
            ] }) }, index)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "py-2 text-center", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: resetForm,
            className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors",
            children: [
              "Visualise another Brand",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950 dark:text-white" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 dark:bg-white bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-space-mono text-lg text-slate-900 dark:text-gray-300 max-w-md leading-relaxed", children: "Track and manage your brand’s presence across leading AI platforms." }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://github.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-space-mono text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
                children: "Github"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://linkedin.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-space-mono text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
                children: "LinkedIn"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 dark:text-white mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-gray-400", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                placeholder: "Email Address",
                className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900 dark:text-gray-100"
              }
            ),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500 dark:text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "font-space-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
              children: "Terms of Use"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "font-space-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
              children: "Privacy Policy"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function AboutPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "About VISIBI - 20+ Years Search Expertise | AI Visibility Pioneers" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "VISIBI was founded by search marketing veterans with 20+ years experience. We combine deep SEO expertise with cutting-edge AI research to help brands dominate AI-powered discovery." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "VISIBI team, AI visibility experts, SEO professionals, GEO consultants, search marketing veterans" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/about" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/about" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "About VISIBI - 20+ Years Search Expertise | AI Visibility Pioneers" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Founded by search marketing veterans with 20+ years experience. We help brands dominate AI-powered discovery across ChatGPT, Gemini, and Perplexity." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "About VISIBI - AI Visibility Pioneers" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "20+ years of search expertise reimagined for the AI era. Learn about our mission and team." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "about" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 dark:border-gray-800 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full ", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsxs("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: [
        "Born from Search.",
        /* @__PURE__ */ jsx("span", { className: "block", children: "Built for Gen AI." })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "Two decades of search expertise, reimagined for the era of generative AI." })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white dark:bg-gray-950 border-t border-b border-r border-l border-slate-300 dark:border-gray-800 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 dark:border-gray-800 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 dark:border-gray-800 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-inter font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 dark:text-white mb-8", children: "The VISIBI Story" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 font-open-sans text-lg font-thin leading-[1.7] text-slate-950 dark:text-gray-200", children: [
            /* @__PURE__ */ jsx("p", { children: "VISIBI was founded by search marketing veterans who spent 20+ years building visibility strategies for brands across EMEA markets. We've navigated every major algorithm shift, platform evolution, and industry transformation since the early days of Google." }),
            /* @__PURE__ */ jsx("p", { children: "In 2022, we watched ChatGPT fundamentally change how people discover information. Within months, millions of users were bypassing traditional search engines entirely—asking AI platforms for recommendations, comparisons, and solutions instead." }),
            /* @__PURE__ */ jsx("p", { children: "We realized that decades of search expertise needed to evolve. The rules that governed Google rankings didn't directly apply to AI-generated responses. Brands that dominated traditional search were invisible in AI conversations. A new discipline was emerging—and we needed to lead it." }),
            /* @__PURE__ */ jsxs("p", { children: [
              "VISIBI was born from this insight: ",
              /* @__PURE__ */ jsx("strong", { children: "visibility in the AI era requires new strategies, new measurement, and new thinking." })
            ] }),
            /* @__PURE__ */ jsx("p", { children: "We combined our deep search knowledge with cutting-edge AI research, built proprietary tracking tools, and developed methodologies specifically for generative engine optimization. Today, we help brands appear, get cited, and earn trust across ChatGPT, Gemini, Perplexity, and the next generation of AI platforms." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("section", { className: "py-8 mb-24 md:px-16 px-0 bg-white dark:bg-slate-900/50 rounded-xl pattern-background", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:max-w-3xl max-w-full lg:ms-8 mb-8 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "lg:px-16 px-0 py-16 bg-white dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 dark:text-white mb-4", children: "Our Mission" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-3xl leading-[1.4] font-light text-slate-950 dark:text-gray-300", children: "To ensure every brand has the opportunity to be discovered, understood, and trusted by AI platforms—leveling the playing field in an era where algorithmic citations shape perception and influence purchase decisions." })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:max-w-3xl max-w-full lg:me-8 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "lg:px-16 px-0 py-16 bg-white dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 dark:text-white mb-4", children: "Our Vision" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-3xl font-thin leading-[1.4] text-slate-950 dark:text-gray-300", children: "A future where AI-powered discovery is transparent, accurate, and accessible—where brands earn visibility through authority and quality, not manipulation or luck." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-t border-b border-slate-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 dark:text-white mb-4", children: "The VISIBI Framework" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 dark:text-gray-300 max-w-2xl", children: "Our methodology is built on three core principles that guide every strategy and recommendation." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 py-0 border-slate-300 border transition-colors pattern-background", children: [
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none lg:border-r border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "mx-auto py-8", children: [
              /* @__PURE__ */ jsx(Award, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Authority First" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "AI platforms cite authoritative sources. We help you build the signals of credibility that earn citations." })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none lg:border-r lg:border-l border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "mx-auto py-8", children: [
              /* @__PURE__ */ jsx(Eye, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Context Matters" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "It's not just about mentions—it's about appearing in the right context with accurate, positive descriptions." })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none lg:border-l border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "mx-auto py-8", children: [
              /* @__PURE__ */ jsx(TrendingUp, { size: 32, strokeWidth: 1.25, absoluteStrokeWidth: true, className: "text-blue-700 mb-2" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Measurement Drives Growth" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "You can't optimize what you don't measure. We quantify AI visibility and tie it to business outcomes." })
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-12 text-left", children: /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 dark:text-white mb-8", children: "Built on Deep Expertise" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 border-slate-300 border transition-colors pattern-background", children: [
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-r md:border-b border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "20+ Years in Search" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "Enterprise SEO, paid media, and content strategy across B2B and consumer brands." })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-l md:border-b border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "EMEA Market Experience" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "Multi-market visibility strategies across Europe, Middle East, and Africa." })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-r md:border-t border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "AI Research & Development" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "Proprietary tools and methodologies for tracking and optimizing AI platform visibility." })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "rounded-none border-0 shadow-none md:border-l md:border-t border-slate-300 transition-colors", children: /* @__PURE__ */ jsxs(CardHeader, { className: "w-3/4 mx-auto py-8", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "font-space-mono pb-2 text-xl font-normal uppercase", children: "Cross-Disciplinary Team" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "font-open-sans text-md text-slate-950 dark:text-gray-400", children: "SEO specialists, content strategists, data scientists, and AI researchers working together." })
            ] }) })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white dark:bg-gray-950 rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 dark:border-gray-800 mb-32", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 dark:border-gray-800 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 dark:border-gray-800 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-4xl leading-[1.3] text-slate-950 dark:text-white", children: "Let's Build Your AI Visibility Strategy" }),
        /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.7] text-slate-950 dark:text-gray-300", children: "Ready to work with a team that combines decades of search expertise with cutting-edge AI optimization?" }),
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors", children: [
          "Talk to a Specialist",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950 dark:text-white" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 dark:bg-white bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 dark:text-gray-300 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://github.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-space-mono text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
                children: "Github"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://linkedin.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-space-mono text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
                children: "LinkedIn"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 dark:text-white mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-gray-400", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                placeholder: "Email Address",
                className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900 dark:text-gray-100"
              }
            ),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500 dark:text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "font-space-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
              children: "Terms of Use"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "font-space-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 uppercase tracking-wide",
              children: "Privacy Policy"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function GEOPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const frameworkItems = [
    {
      icon: Target,
      title: "Citation Discovery",
      description: "Identify where Gen AI platforms source information about your industry and competitors."
    },
    {
      icon: FileText,
      title: "Content Optimization",
      description: "Structure content to maximize Gen AI comprehension and citation probability."
    },
    {
      icon: BarChart3,
      title: "Authority Signals",
      description: "Build credibility markers that Gen AI platforms recognize and trust."
    },
    {
      icon: RefreshCw,
      title: "Source Diversification",
      description: "Expand your citation footprint across multiple authoritative platforms."
    },
    {
      icon: CheckCircle2,
      title: "Sentiment Optimization",
      description: "Ensure Gen AI describes your brand with positive, accurate context."
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Monitor mentions, citations, and visibility across all Gen AI platforms."
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "GEO Services - Generative Engine Optimization | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Get discovered and cited by ChatGPT, Gemini, and Perplexity. Expert GEO (Generative Engine Optimization) services to maximize your AI visibility and brand mentions." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "GEO, generative engine optimization, ChatGPT optimization, AI platform visibility, Gemini SEO, Perplexity optimization" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/geo" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/geo" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "GEO Services - Generative Engine Optimization | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Get discovered and cited by ChatGPT, Gemini, and Perplexity. Expert GEO services to maximize your AI visibility." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "GEO Services - Generative Engine Optimization" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Maximize your brand's visibility across AI platforms. Get cited by ChatGPT, Gemini, and Perplexity." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "geo" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "Generative Engine Optimization (GEO)" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "Get discovered, cited, and positively represented by Gen AI platforms like ChatGPT, Gemini, and Perplexity." }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 mr-2" }),
        "Request GEO Audit"
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "What is GEO?" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 font-open-sans text-lg font-thin leading-[1.7] text-slate-950", children: [
            /* @__PURE__ */ jsx("p", { children: "Generative Engine Optimization (GEO) is the practice of optimizing your digital presence to maximize visibility, citations, and positive perception within Gen AI-powered platforms." }),
            /* @__PURE__ */ jsx("p", { children: "As millions of users shift from traditional search to conversational Gen AI for discovery and research, your brand's presence in these Gen AI-generated responses becomes critical for awareness, consideration, and trust-building." }),
            /* @__PURE__ */ jsx("p", { children: "VISIBI's GEO methodology ensures your brand appears in the right context, with accurate information and positive sentiment, when potential customers ask Gen AI platforms about solutions in your category." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-t border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-inter font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "The VISIBI GEO Framework" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 max-w-2xl", children: "A comprehensive methodology for optimizing Gen AI visibility across all platforms." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-slate-300 border transition-colors pattern-background", children: frameworkItems.map((item, index) => {
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs("div", { className: "bg-white border-0 border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx(Icon, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: item.title }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: item.description })
            ] }, index);
          }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("div", { className: "text-left mb-12", children: /* @__PURE__ */ jsx("h2", { className: "font-inter font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "SEO vs GEO: Understanding the Difference" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-2xl leading-[1.3] text-slate-950 mb-6", children: "Traditional SEO" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 font-open-sans text-md leading-[1.5] text-slate-950", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-slate-950 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Optimizes for search engine rankings" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-slate-950 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Focuses on keywords and backlinks" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-slate-950 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Success = higher SERP positions" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-slate-950 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Drives traffic to your website" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-slate-950 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "User decides which result to click" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-blue-700 p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-2xl leading-[1.3] text-slate-950 mb-6", children: "GEO (Generative Engine Optimization)" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 font-open-sans text-md leading-[1.5] text-slate-950", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Optimizes for Gen AI platform mentions" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Focuses on citations and authority" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Success = being cited in Gen AI responses" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Builds trust before website visit" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "AI recommends your brand directly" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function SEOPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const frameworkItems = [
    {
      icon: Search,
      title: "Technical Foundation",
      description: "Site architecture, crawlability, indexability, Core Web Vitals, mobile-first optimization"
    },
    {
      icon: FileText,
      title: "Content Excellence",
      description: "E-E-A-T content, keyword strategy, semantic optimization, Gen AI-comprehensible structure"
    },
    {
      icon: Link2,
      title: "Authority Building",
      description: "Strategic link building, digital PR, thought leadership, brand entity development"
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Rankings, organic traffic, conversions, Gen AI citations, competitor benchmarking"
    }
  ];
  const processSteps = [
    {
      title: "Audit & Analysis",
      description: "Technical SEO audit, content gap analysis, competitor research, keyword mapping, Gen AI visibility baseline"
    },
    {
      title: "Strategy Development",
      description: "Prioritized roadmap, content calendar, technical fixes, link building targets, KPI framework"
    },
    {
      title: "Implementation",
      description: "Technical optimizations, content creation/optimization, schema markup, internal linking, page experience"
    },
    {
      title: "Authority Growth",
      description: "Link acquisition, digital PR campaigns, brand mentions, expert positioning, citation building"
    },
    {
      title: "Measurement & Iteration",
      description: "Performance tracking, Gen AI visibility monitoring, continuous optimization, quarterly strategy reviews"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "AI-Ready SEO Services - Search + AI Optimization | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "SEO that feeds your AI visibility. Build search rankings and AI citations simultaneously with technical SEO, content strategy, and authority building that works across Google and AI platforms." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "AI-ready SEO, technical SEO, content optimization, link building, E-E-A-T, search engine optimization, AI citations" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/seo" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/seo" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "AI-Ready SEO Services - Search + AI Optimization | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "SEO that powers both Google rankings and AI platform citations. Technical excellence meets AI-first content strategy." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "AI-Ready SEO Services | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "SEO that feeds your AI visibility. Build rankings and citations simultaneously." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "seo" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "SEO that feeds your AI visibility" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "We build search visibility that powers both traditional search and Gen AI discovery — helping your brand appear, get cited, and trusted across Google, ChatGPT, Gemini, and Perplexity." }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 mr-2" }),
        "Request SEO Audit"
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs("section", { className: "py-12 mb-12 border-b border-slate-200", children: [
          /* @__PURE__ */ jsx("div", { className: "md:max-w-3xl max-w-full mx-0 md:text-left md:px-16 px-0", children: /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "The VISIBI SEO Framework" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 max-w-2xl", children: "Our approach combines proven SEO fundamentals with AI-first optimization" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-slate-300 border transition-colors pattern-background", children: frameworkItems.map((item, index) => {
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs("div", { className: "bg-white border-0 border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx(Icon, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: item.title }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: item.description })
            ] }, index);
          }) }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "py-12 mb-12", children: [
          /* @__PURE__ */ jsx("div", { className: "md:max-w-4xl max-w-full mx-0 md:text-left md:px-16 px-0", children: /* @__PURE__ */ jsxs("div", { className: "text-left mb-12", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "How We Build Your SEO Success" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950", children: "A structured 5-phase approach to sustainable organic growth" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-0 md:px-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto p-4 grid md:grid-cols-1 lg:grid-cols-2 gap-4 border-slate-300 border transition-colors pattern-background", children: processSteps.map((step, index) => /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-white p-6 mb-4 border border-slate-300", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border border-blue-700 text-blue-700 rounded-full flex items-center justify-center font-open-sans font-semibold text-md mb-4", children: index + 1 }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-2 uppercase", children: step.title }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: step.description })
          ] }) }, index)) }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-left mb-12", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "AI-Ready SEO vs Traditional SEO" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl md:leading-[1.5] text-slate-950", children: "The difference that powers AI citations" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-2xl leading-[1.3] text-slate-950 mb-6", children: "Traditional SEO" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 font-open-sans text-md leading-[1.5] text-slate-950", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 flex-shrink-0 mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: "Optimizes for keyword rankings" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 flex-shrink-0 mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: "Focuses on traffic volume" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 flex-shrink-0 mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: "Content structured for search engines" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 flex-shrink-0 mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: "Success = top 3 rankings" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 flex-shrink-0 mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: "Link building for PageRank" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-2 border-blue-700 p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-2xl leading-[1.3] text-slate-950 mb-6", children: "VISIBI AI-Ready SEO" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 font-open-sans text-md leading-[1.5] text-slate-950", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Optimizes for AI comprehension & citations" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Focuses on authority & trust signals" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Content structured for AI & humans" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Success = rankings + AI mentions" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Link building for entity authority" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function PPCPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "PPC Management Services - Paid Media That Amplifies Visibility | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Performance-driven PPC campaigns across Google Ads, LinkedIn, Meta, and YouTube. Boost visibility, drive conversions, and reinforce your organic and AI search presence." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "PPC management, Google Ads, LinkedIn advertising, Meta ads, YouTube ads, paid media strategy, performance marketing" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/ppc" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/ppc" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "PPC Management Services - Paid Media That Amplifies Visibility | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Data-driven PPC campaigns across Google Ads, LinkedIn, Meta, and YouTube that amplify your brand visibility." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "PPC Management Services | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Performance campaigns that boost visibility and drive conversions across all major platforms." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "ppc" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "Performance campaigns that amplify visibility" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "From Google Ads to LinkedIn, our paid media strategies boost visibility, drive conversions, and reinforce your organic and Gen AI search presence." }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 mr-2" }),
        "Book Paid Media Audit"
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Channels & Platforms" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 max-w-2xl", children: "Strategic paid media across the platforms where your audience discovers and evaluates solutions." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-slate-300 border transition-colors pattern-background", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx(Search, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: "Google & Bing Search" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: "High-intent search campaigns targeting buyers actively looking for solutions." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx(Share2, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: "Meta (Facebook & Instagram)" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: "Brand awareness and demand generation with sophisticated audience targeting." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx(Briefcase, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: "LinkedIn Campaigns" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: "Precision B2B targeting by job title, industry, company size, and seniority." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx(Video, { size: 32, strokeWidth: 1.25, className: "text-blue-700 mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: "YouTube Video Ads" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: "Video campaigns for brand storytelling and engagement with visual audiences." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-inter font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Our Approach" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl md:leading-[1.5] text-slate-950", children: "Data-driven campaigns optimized for both immediate conversions and long-term brand visibility." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-300 p-4", children: /* @__PURE__ */ jsxs("div", { className: "p-8 grid md:grid-cols-2 gap-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white border border-slate-950 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6 text-slate-950" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-space-mono text-md text-slate-950 font-normal uppercase", children: "Precision Targeting" }),
                /* @__PURE__ */ jsx("p", { className: "font-open-sans text-sm text-slate-600", children: "Right audience, right time" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white border border-slate-950 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6 text-slate-950" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-space-mono text-md text-slate-950 font-normal uppercase", children: "AI-Powered Optimization" }),
                /* @__PURE__ */ jsx("p", { className: "font-open-sans text-sm text-slate-600", children: "Automated bid & budget management" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white border border-slate-950 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6 text-slate-950" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-space-mono text-md text-slate-950 font-normal uppercase", children: "Cross-Channel Synergy" }),
                /* @__PURE__ */ jsx("p", { className: "font-open-sans text-sm text-slate-600", children: "Integrated with SEO & GEO data" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white border border-slate-950 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6 text-slate-950" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-space-mono text-md text-slate-950 font-normal uppercase", children: "Continuous Testing" }),
                /* @__PURE__ */ jsx("p", { className: "font-open-sans text-sm text-slate-600", children: "Always learning, always improving" })
              ] })
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Process → Plan → Launch → Optimise → Scale" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950", children: "Our systematic approach to building high-performing paid media campaigns." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 pattern-background p-4 border-slate-300 border", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-inter font-semibold text-md mb-6", children: "1" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Plan" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Define objectives, research audiences, select channels, and establish KPIs and budget allocation strategy." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-inter font-semibold text-md mb-6", children: "2" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Launch" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Build campaigns, create ad copy and creative, configure tracking, and deploy with proper attribution setup." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-inter font-semibold text-md mb-6", children: "3" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Optimise" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Analyze performance, test variations, refine targeting, adjust bids, and improve quality scores continuously." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 p-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-inter font-semibold text-md mb-6", children: "4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Scale" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Increase budget on proven winners, expand to new audiences, test new platforms, and maximize ROI." })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function InsightsPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "GEO", "SEO", "Strategy", "Analytics", "Case Studies"];
  const insights = [
    {
      title: "How ChatGPT Discovers & Cites Brands in 2025",
      category: "GEO",
      date: "Oct 15, 2025",
      excerpt: "Deep analysis of the technical mechanisms ChatGPT uses to source information and how brands can optimize for citations.",
      readTime: "8 min read"
    },
    {
      title: "The Complete Guide to AI Search Optimization",
      category: "Strategy",
      date: "Oct 10, 2025",
      excerpt: "Everything you need to know about optimizing your brand's presence across AI platforms—from fundamentals to advanced tactics.",
      readTime: "12 min read"
    },
    {
      title: "Measuring Brand Visibility Across AI Platforms",
      category: "Analytics",
      date: "Oct 5, 2025",
      excerpt: "How to track, measure, and report on your AI visibility performance with quantitative frameworks and tools.",
      readTime: "10 min read"
    },
    {
      title: "GEO vs SEO: Understanding the Strategic Difference",
      category: "GEO",
      date: "Sep 28, 2025",
      excerpt: "Why generative engine optimization requires fundamentally different tactics than traditional search engine optimization.",
      readTime: "7 min read"
    },
    {
      title: "The Authority Signals AI Platforms Trust",
      category: "Strategy",
      date: "Sep 20, 2025",
      excerpt: "Research findings on what makes AI engines more likely to cite certain sources over others.",
      readTime: "9 min read"
    },
    {
      title: "Case Study: 300% Increase in AI Mentions in 6 Months",
      category: "Case Studies",
      date: "Sep 15, 2025",
      excerpt: "How a B2B SaaS company transformed their AI visibility through structured GEO strategy.",
      readTime: "11 min read"
    },
    {
      title: "Content Structure for Maximum AI Comprehension",
      category: "GEO",
      date: "Sep 8, 2025",
      excerpt: "Technical best practices for structuring content so AI platforms can easily extract and cite information.",
      readTime: "8 min read"
    },
    {
      title: "The Future of Search: 2026 Predictions",
      category: "Strategy",
      date: "Sep 1, 2025",
      excerpt: "Expert predictions on how AI-powered search will evolve and what brands should prepare for.",
      readTime: "10 min read"
    },
    {
      title: "Schema Markup for AI Platforms",
      category: "SEO",
      date: "Aug 25, 2025",
      excerpt: "How structured data influences both traditional search rankings and AI platform understanding.",
      readTime: "9 min read"
    }
  ];
  const filteredInsights = selectedCategory === "All" ? insights : insights.filter((insight) => insight.category === selectedCategory);
  const getCategoryIcon = (category) => {
    switch (category) {
      case "GEO":
        return Brain;
      case "SEO":
        return Search;
      case "Strategy":
        return Target;
      case "Analytics":
        return TrendingUp;
      case "Case Studies":
        return BookOpen;
      default:
        return Brain;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "AI Visibility Insights & Research - GEO Strategy Frameworks | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Deep dives, case studies, and strategic frameworks for mastering visibility in generative AI. Learn how to optimize for ChatGPT, Gemini, and Perplexity with expert insights." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "GEO insights, AI visibility research, ChatGPT optimization guide, AI search strategy, generative AI marketing, SEO case studies" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/insights" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/insights" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "AI Visibility Insights & Research - GEO Strategy Frameworks | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Expert insights, case studies, and frameworks for optimizing brand visibility across AI platforms." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "AI Visibility Insights & Research | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Learn how to dominate AI-powered discovery with expert frameworks and case studies." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "insights" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "AI Visibility Insights & Research" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "Deep dives, case studies, and strategic frameworks for mastering visibility in the age of generative AI." })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("section", { className: "py-8 mb-12 border-b border-slate-200", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 justify-center", children: categories.map((category) => /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setSelectedCategory(category),
            variant: selectedCategory === category ? "default" : "outline",
            className: `rounded-full font-inter font-semibold text-sm ${selectedCategory === category ? "bg-slate-950 text-white hover:bg-slate-800 border border-slate-950" : "bg-transparent text-slate-950 border border-slate-300 hover:border-slate-950"}`,
            children: category
          },
          category
        )) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-16", children: filteredInsights.map((insight, index) => {
          const IconComponent = getCategoryIcon(insight.category);
          return /* @__PURE__ */ jsxs(
            "article",
            {
              className: "bg-white border border-slate-300 rounded-xl overflow-hidden hover:border-blue-700 transition-all duration-300 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-48 bg-slate-50 border-b border-slate-300 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-16 h-16 text-blue-700", strokeWidth: 1.25 }) }),
                /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-space-mono text-xs text-slate-950 bg-white border border-slate-950 px-3 py-1 rounded-full uppercase", children: insight.category }),
                    /* @__PURE__ */ jsx("span", { className: "font-space-mono text-xs text-slate-600", children: insight.readTime })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: insight.title }),
                  /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950 mb-4", children: insight.excerpt }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-space-mono text-xs text-slate-600", children: insight.date }),
                    /* @__PURE__ */ jsxs("button", { className: "font-space-mono text-sm text-slate-950 hover:text-blue-700 inline-flex items-center gap-1 transition-colors", children: [
                      "Read More ",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                    ] })
                  ] })
                ] })
              ]
            },
            index
          );
        }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Stay Ahead of AI Search Evolution" }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 mb-8", children: "Get monthly insights, research findings, and strategic frameworks delivered to your inbox." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                placeholder: "your@email.com",
                className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900"
              }
            ),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Subscribe" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function ToolPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const features = [
    {
      icon: Eye,
      title: "AI Platform Mentions",
      description: "Track how frequently your brand appears across ChatGPT, Gemini, Perplexity, and other AI engines."
    },
    {
      icon: MessageSquare,
      title: "Citation Analysis",
      description: "See exactly where and how AI platforms cite your content, with full context and source attribution."
    },
    {
      icon: Heart,
      title: "Sentiment Tracking",
      description: "Monitor the tone and sentiment of AI-generated brand descriptions—positive, neutral, or negative."
    },
    {
      icon: TrendingUp,
      title: "Visibility Index",
      description: "Proprietary score measuring your overall presence and prominence across AI platforms over time."
    },
    {
      icon: Users,
      title: "Competitor Share",
      description: "Compare your AI visibility against competitors to identify opportunities and threats."
    },
    {
      icon: Download,
      title: "Data Exports",
      description: "Export raw data, trends, and reports for deeper analysis and stakeholder presentations."
    },
    {
      icon: Zap,
      title: "Real-Time Alerts",
      description: "Get notified when significant changes occur in your AI visibility or competitor mentions."
    }
  ];
  const faqs = [
    {
      question: "What is the VISIBI Visibility Tool?",
      answer: "The VISIBI Tool is a proprietary platform for tracking and measuring your brand's presence across AI engines. It monitors mentions, citations, sentiment, and competitive positioning across ChatGPT, Gemini, Perplexity, and other generative AI platforms."
    },
    {
      question: "How does the tool track AI platform mentions?",
      answer: "We use automated query testing across AI platforms, analyzing thousands of industry-relevant questions to identify when and how your brand appears. Our technology captures response variations, citation patterns, and context to provide comprehensive visibility data."
    },
    {
      question: "How accurate is the sentiment analysis?",
      answer: "Our sentiment analysis uses advanced natural language processing to evaluate the tone and context of brand mentions. While no automated system is perfect, our accuracy rate exceeds 90% and is continuously refined through machine learning and human validation."
    },
    {
      question: "Can I track multiple brands or competitors?",
      answer: "Yes. The tool allows you to monitor your own brand plus unlimited competitors, providing comparative analysis of visibility share, citation frequency, and sentiment across the AI landscape."
    },
    {
      question: "How often is data updated?",
      answer: "Data is refreshed daily for core metrics and weekly for comprehensive analysis. Real-time alerts notify you of significant changes as they're detected, ensuring you never miss important shifts in AI visibility."
    },
    {
      question: "What AI platforms does the tool monitor?",
      answer: "We currently track ChatGPT (OpenAI), Gemini (Google), Perplexity, Claude (Anthropic), and Microsoft Copilot. We continuously add new platforms as they gain market significance."
    },
    {
      question: "Is the tool available as standalone software?",
      answer: "The VISIBI Tool is currently available exclusively to clients working with us on GEO, SEO, or integrated visibility strategies. This ensures you have expert support to interpret data and act on insights effectively."
    },
    {
      question: "Can the tool integrate with other analytics platforms?",
      answer: "Yes. We offer API access and integrations with Google Analytics, Google Data Studio, and other business intelligence tools to combine AI visibility data with your broader marketing analytics."
    },
    {
      question: "What's the difference between the tool and manual monitoring?",
      answer: "Manual monitoring is time-intensive, inconsistent, and limited in scale. The VISIBI Tool automates thousands of queries daily, tracks historical trends, identifies patterns, and provides quantitative measurement that's impossible to achieve manually."
    },
    {
      question: "How do I get access to the VISIBI Tool?",
      answer: "The tool is included in all comprehensive GEO engagements and available as an add-on for SEO and PPC clients. Contact us to request early access and see a live demo of your current AI visibility."
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "AI Visibility Tracking Tool - Monitor Brand Mentions Across AI Platforms | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Track mentions, citations, sentiment, and competitive positioning across ChatGPT, Gemini, Perplexity, and Claude. Proprietary AI visibility analytics platform with real-time alerts." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "AI visibility tool, ChatGPT tracking, AI mention monitoring, brand sentiment analysis, AI platform analytics, citation tracking" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/tool" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/tool" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "AI Visibility Tracking Tool - Monitor Brand Mentions | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Track your brand's mentions, citations, and sentiment across all major AI platforms with powerful analytics and real-time alerts." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "AI Visibility Tracking Tool | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Monitor how AI platforms mention and cite your brand. Get actionable insights and competitive intelligence." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "tool" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-24 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "See how Gen AI talks about your Brand" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "Track mentions, citations, sentiment, and competitive positioning across ChatGPT, Gemini, Perplexity, and other Gen AI platforms." }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 mr-2" }),
        "Request Early Access"
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-8 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs("section", { className: "py-12 mb-12 border-b border-slate-200", children: [
          /* @__PURE__ */ jsx("div", { className: "md:max-w-2xl max-w-full mx-0 md:text-left md:px-16 px-0", children: /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Comprehensive AI Visibility Intelligence" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 max-w-2xl", children: "Everything you need to measure, monitor, and improve your brand's presence in the AI era." })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-slate-300 border transition-colors pattern-background", children: features.map((feature, index) => {
            const Icon = feature.icon;
            return /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white flex items-center justify-center mb-6 flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-blue-700" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: feature.title }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: feature.description })
            ] }, index);
          }) }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "py-12 mb-12", children: [
          /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-0 md:px-16", children: /* @__PURE__ */ jsx("div", { className: "mb-12 text-left", children: /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Why AI Visibility Tracking Matters" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "md:max-w-7xl max-w-full mx-auto md:px-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0 grid grid-cols-1 lg:grid-cols-3 gap-6 border-slate-300 border transition-colors pattern-background", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "You Can't Optimize What You Don't Measure" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Traditional analytics show website traffic after users discover you. AI visibility tracking reveals how users discover you in the first place—the critical awareness stage that determines whether prospects ever reach your website." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Competitive Intelligence" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "See exactly how your visibility compares to competitors. Identify which brands dominate AI mentions in your category and understand the specific contexts where they're being cited instead of you." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Prove ROI of GEO Investments" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Demonstrate the impact of GEO efforts with quantitative data. Track mention growth, sentiment improvements, and citation quality over time to show stakeholders the value of AI visibility optimization." })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Powerful Insights, Intuitive Interface" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950", children: "Access all your AI visibility data through clean, actionable dashboards designed for both tactical optimization and executive reporting." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white p-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
            /* @__PURE__ */ jsx("img", { src: "./sample-dash.png", alt: "VISIBI AI visibility tracking dashboard interface showing mention trends, citation analysis, sentiment scores, and competitive positioning metrics across AI platforms", className: "rounded-xl border border-slate-200 pattern-background p-2 mb-8" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "Interactive dashboards showing real-time AI visibility metrics, historical trends, competitive benchmarks, and actionable recommendations." })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("div", { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Frequently Asked Questions" }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 overflow-hidden", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setOpenFaqIndex(openFaqIndex === index ? null : index),
                className: "w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors",
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-open-sans font-semibold text-lg text-slate-950 pr-4", children: faq.question }),
                  openFaqIndex === index ? /* @__PURE__ */ jsx(ChevronUp$1, { className: "w-5 h-5 text-slate-950 flex-shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown$1, { className: "w-5 h-5 text-slate-950 flex-shrink-0" })
                ]
              }
            ),
            openFaqIndex === index && /* @__PURE__ */ jsx("div", { className: "px-8 pb-6", children: /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md md:leading-[1.7] my-8 text-slate-950", children: faq.answer }) })
          ] }, index)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto md:px-16 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-open-sans font-thin text-3xl md:text-5xl md:leading-[1.3] text-slate-950 mb-4", children: "Request Early Access to the VISIBI Tool" }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 mb-8", children: "See exactly how AI platforms currently describe your brand and get visibility insights your competitors don't have." }),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(
            Button,
            {
              className: "inline-flex items-center px-8 py-6 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors",
              children: "Request Access"
            }
          ) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function HowWeWorkPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const attributes = [
    {
      icon: Brain,
      title: "Curious & Analytical",
      description: "We question assumptions, test hypotheses, and base recommendations on data—not trends or guesses."
    },
    {
      icon: Heart,
      title: "Radically Transparent",
      description: "Full visibility into methods, performance, and challenges. No black boxes, no BS."
    },
    {
      icon: Target,
      title: "Results-Obsessed",
      description: "We optimize for business outcomes, not vanity metrics. Every action ties to revenue impact."
    },
    {
      icon: Users,
      title: "Partnership-Oriented",
      description: "We're an extension of your team—collaborative, responsive, and invested in your success."
    },
    {
      icon: TrendingUp,
      title: "Continuous Learners",
      description: "AI platforms evolve daily. We stay ahead through constant research, testing, and adaptation."
    },
    {
      icon: Shield,
      title: "Ethical & Sustainable",
      description: "We use only white-hat tactics that build long-term authority, never shortcuts that risk penalties."
    },
    {
      icon: Lightbulb,
      title: "Strategic Thinkers",
      description: "We see the big picture and connect visibility strategies to broader business goals."
    }
  ];
  const processSteps = [
    {
      phase: "Discovery",
      description: "Initial consultation to understand your business, competitive landscape, current visibility, and strategic goals. We determine if there's a good fit and outline potential approach."
    },
    {
      phase: "Audit & Analysis",
      description: "Comprehensive assessment of your current AI visibility, content authority, technical infrastructure, and competitive positioning. We identify quick wins and long-term opportunities."
    },
    {
      phase: "Strategy Development",
      description: "Custom roadmap with prioritized tactics, timeline, resource requirements, and expected outcomes. Clear KPIs tied to business impact."
    },
    {
      phase: "Kickoff & Alignment",
      description: "Team introductions, tool access setup, stakeholder alignment on goals and communication cadence. We establish success criteria and reporting frameworks."
    },
    {
      phase: "Implementation",
      description: "Execute the strategy—content optimization, technical improvements, authority building, and ongoing monitoring. Weekly check-ins and progress updates."
    },
    {
      phase: "Measurement & Optimization",
      description: "Track performance against KPIs, identify what's working, double down on winners, and adjust tactics that underperform. Monthly strategic reviews."
    },
    {
      phase: "Continuous Improvement",
      description: "As AI platforms evolve and your business grows, we adapt strategies, test new opportunities, and maintain your competitive advantage."
    }
  ];
  const faqs = [
    {
      question: "What's your typical engagement model?",
      answer: "We offer both project-based engagements (audits, strategy development) and ongoing retainers for implementation and optimization. Most clients start with a discovery phase, then move to 6-12 month retainers as we execute and refine strategies together."
    },
    {
      question: "How hands-on is your team?",
      answer: "Very. We don't just deliver recommendations and disappear. We actively implement, monitor, optimize, and collaborate with your team throughout the engagement. You'll have direct access to strategists, not account managers reading from scripts."
    },
    {
      question: "Do you work with agencies or only direct clients?",
      answer: "We work with both. For agencies, we offer white-label GEO services and expert consultation. For direct clients, we can integrate with existing agency partners or serve as your full visibility team."
    },
    {
      question: "What size companies do you typically work with?",
      answer: "We work primarily with mid-market to enterprise B2B companies and ambitious growth-stage startups. If you're serious about AI visibility and have meaningful budget to invest in strategic advantage, we're a fit."
    },
    {
      question: "How do you handle confidentiality and competitive conflicts?",
      answer: "All client work is covered by NDAs. We don't work with direct competitors simultaneously in the same vertical. Your strategies, data, and insights remain confidential."
    },
    {
      question: "What do you need from us to be successful?",
      answer: "Access to your website, analytics, and existing marketing assets. Collaboration from your content and technical teams. Executive alignment on goals and KPIs. And a willingness to invest in long-term visibility rather than expecting overnight miracles."
    },
    {
      question: "How do you charge for services?",
      answer: "Pricing varies based on scope, complexity, and business size. We offer custom proposals after initial consultation. Generally: audits start at $5k, ongoing GEO retainers start at $8k/month, and comprehensive programs (GEO + SEO + PPC) start at $15k/month."
    },
    {
      question: "Do you guarantee specific results?",
      answer: "We don't guarantee rankings or specific mention counts because AI algorithms are proprietary and constantly changing. However, we do guarantee strategic rigor, transparent reporting, and continuous optimization based on performance data."
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative line-pattern", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "How We Work - Strategy, Transparency & Trust | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Partner with VISIBI for data-driven AI visibility strategy. Learn our values, process, and approach to building lasting Gen AI presence through ethical tactics and relentless optimization." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "GEO methodology, AI visibility strategy, transparent SEO agency, data-driven marketing, ethical optimization" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://visibi.com/how-we-work" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://visibi.com/how-we-work" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "How We Work - Strategy, Transparency & Trust | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Discover our values, methodology, and commitment to transparent, data-driven AI visibility optimization." }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "How We Work | VISIBI" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Strategy, transparency, and trust in AI visibility optimization." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]" }),
    /* @__PURE__ */ jsx(Navigation, { currentPage: "how-we-work" }),
    /* @__PURE__ */ jsx("section", { className: "max-w-[90%] mx-auto items-center lg:px-[5rem] mb-0 mt-12 relative bg-white border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none shadow-sm shadow-blue-200", children: /* @__PURE__ */ jsx("div", { className: "lg:block h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 border-l border-r border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl px-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-open-sans text-4xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]", children: "Strategy, Transparency & Trust" }),
      /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "How we partner with brands to build lasting Gen AI visibility through data-driven strategy, ethical tactics, and relentless optimization." })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl" }),
      /* @__PURE__ */ jsx("div", { className: "lg:block absolute h-full w-0 md:w-20 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("section", { className: "py-24 mb-12 border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "md:max-w-7xl max-w-full mx-auto md:text-left md:px-16 px-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-md md:text-xl md:leading-[1.7] tracking-tight font-thin text-slate-950 pb-8", children: "What We Value (And Hire For)" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 max-w-2xl", children: "These attributes define how we work, make decisions, and partner with clients." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-slate-300 border transition-colors pattern-background", children: attributes.map((attr, index) => {
            const Icon = attr.icon;
            return /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 hover:border-blue-700 transition-all", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white border border-slate-950 rounded-xl flex items-center justify-center mb-6 flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-slate-950" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono pb-2 text-xl font-normal uppercase text-slate-950 mb-3", children: attr.title }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md text-slate-950", children: attr.description })
            ] }, index);
          }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-left mb-12", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Our Client Process" }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950", children: "From first conversation to ongoing optimization—here's what working with VISIBI looks like." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: processSteps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-inter font-semibold text-md", children: index + 1 }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 border border-slate-300 rounded-xl p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-2 uppercase", children: step.phase }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: step.description })
            ] })
          ] }, index)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-12 text-left", children: /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Our Ethical Commitments" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 rounded-xl p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "White-Hat Only" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "We never use manipulative tactics, spam, or black-hat techniques that could damage your brand reputation or result in penalties. Every strategy is built for sustainable, long-term success." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 rounded-xl p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Accurate Information" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "We optimize for truthful representation of your brand. We don't fabricate credentials, exaggerate capabilities, or mislead AI platforms about what your company offers." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 rounded-xl p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Platform Respect" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "We work within AI platform guidelines and terms of service. As platforms publish formal GEO standards, we'll adapt practices to align with their preferences." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 rounded-xl p-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-xl leading-[1.3] text-slate-950 mb-3 uppercase", children: "Transparent Reporting" }),
              /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: "We report both successes and challenges. If something isn't working, we tell you immediately and adjust course. No hiding behind jargon or inflated metrics." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16", children: [
          /* @__PURE__ */ jsx("div", { className: "text-left mb-12", children: /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Frequently Asked Questions" }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-300 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setOpenFaqIndex(openFaqIndex === index ? null : index),
                className: "w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors",
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-space-mono font-normal text-lg text-slate-950 uppercase pr-4", children: faq.question }),
                  openFaqIndex === index ? /* @__PURE__ */ jsx(ChevronUp$1, { className: "w-5 h-5 text-slate-950 flex-shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown$1, { className: "w-5 h-5 text-slate-950 flex-shrink-0" })
                ]
              }
            ),
            openFaqIndex === index && /* @__PURE__ */ jsx("div", { className: "px-8 pb-6", children: /* @__PURE__ */ jsx("p", { className: "font-open-sans text-md leading-[1.5] text-slate-950", children: faq.answer }) })
          ] }, index)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 mb-12 border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto md:px-16 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-inter font-medium text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4", children: "Ready to Work Together?" }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-xl leading-[1.5] text-slate-950 mb-8", children: "Let's discuss your AI visibility goals and explore whether VISIBI is the right partner for your brand." }),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center px-8 py-3 bg-slate-950 text-white rounded-full font-medium hover:bg-slate-800 transition-colors", children: "Start a Conversation" }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChartNoAxesGantt, { className: "h-8 w-8 text-slate-950" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold bg-slate-950 bg-clip-text text-transparent", children: "VISIBI" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-open-sans text-lg text-slate-900 max-w-md leading-relaxed", children: "Track and manage your brand's presence across leading AI platforms." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-sans text-xl text-slate-950 mb-2", children: "Want your brand to stand out in the age of AI conversations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay informed with expert updates on brand visibility across AI platforms." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "Email Address", className: "flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" }),
            /* @__PURE__ */ jsx(Button, { className: "bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full", children: "Start Now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", children: /* @__PURE__ */ jsx("p", { className: "font-space-mono text-xs text-gray-500", children: "© 2025 VISIBI — ALL RIGHTS RESERVED" }) })
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(ComingSoon, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(AboutPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/geo", element: /* @__PURE__ */ jsx(GEOPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/seo", element: /* @__PURE__ */ jsx(SEOPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/ppc", element: /* @__PURE__ */ jsx(PPCPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/insights", element: /* @__PURE__ */ jsx(InsightsPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/tool", element: /* @__PURE__ */ jsx(ToolPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/how-we-work", element: /* @__PURE__ */ jsx(HowWeWorkPage, {}) })
  ] });
}
const createApp = ViteSSG(
  /* @__PURE__ */ jsx(React__default.StrictMode, { children: /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(App, {}) }) }) })
);
export {
  createApp
};
