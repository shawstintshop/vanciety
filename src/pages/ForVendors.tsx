import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Sparkles,
  Check,
  UserPlus,
  Package,
  Wand2,
  Users,
  Quote,
  ArrowRight,
} from "lucide-react";

const VENDOR_CTA = "/auth?redirect=/dashboard/vendor";

type ValueProp = {
  icon: typeof Search;
  title: string;
  description: string;
};

const valueProps: ValueProp[] = [
  {
    icon: Search,
    title: "Get Found",
    description:
      "Your brand in front of 100,000+ active van lifers searching for exactly what you sell.",
  },
  {
    icon: ShoppingBag,
    title: "Sell More",
    description:
      "Products, services, and quotes all managed in one place with real customer reviews.",
  },
  {
    icon: Sparkles,
    title: "AI Marketing",
    description:
      "Let AI write your product descriptions, social posts, and SEO content automatically.",
  },
];

type Tier = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

const tiers: Tier[] = [
  {
    name: "FREE",
    price: "$0/mo",
    features: ["Basic listing", "Contact form", "Public profile"],
    cta: "Get Started",
    href: VENDOR_CTA,
  },
  {
    name: "STARTER",
    price: "$49/mo",
    features: [
      "Hosted mini-site",
      "Products",
      "Services",
      "Lead capture",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    href: VENDOR_CTA,
  },
  {
    name: "PRO",
    price: "$149/mo",
    features: [
      "Everything in Starter",
      "AI content",
      "SEO tools",
      "Promotions",
      "Video indexing",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    href: VENDOR_CTA,
    popular: true,
  },
  {
    name: "PARTNER",
    price: "$499/mo",
    features: [
      "Everything in Pro",
      "Featured placement",
      "AI sales agent",
      "Custom domain",
      "Priority support",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@vanciety.com",
  },
];

const logos = [
  "Roam Adventure Co",
  "Agile Off Road",
  "Method Race Wheels",
  "Victron Energy",
];

type Testimonial = {
  quote: string;
  name: string;
  company: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "We listed our build shop for free and had qualified leads in the first week. Vanciety put us in front of exactly the right people.",
    name: "Marcus Hale",
    company: "Overland Built Co",
  },
  {
    quote:
      "The AI content tools wrote better product descriptions than our old agency, and SEO traffic doubled in two months.",
    name: "Priya Nandakumar",
    company: "Solar Nomad Electrical",
  },
  {
    quote:
      "Our customers were already on Vanciety. Setting up a storefront here was the easiest sales decision we ever made.",
    name: "Dana Reyes",
    company: "Cascade Van Outfitters",
  },
];

type Step = {
  icon: typeof UserPlus;
  title: string;
};

const steps: Step[] = [
  { icon: UserPlus, title: "Create your free profile (5 minutes)" },
  { icon: Package, title: "Add your products and services" },
  { icon: Wand2, title: "Let AI generate your content" },
  { icon: Users, title: "Get leads from 100,000+ van lifers" },
];

const faqs = [
  {
    q: "Do I need a website already?",
    a: "No, Vanciety IS your website.",
  },
  {
    q: "How do customers find me?",
    a: "Search, browse categories, events, and AI recommendations.",
  },
  {
    q: "Can I sell products directly?",
    a: "Yes, with Starter and above.",
  },
  {
    q: "What makes this different from my own website?",
    a: "Your customers are already here.",
  },
  {
    q: "Is there a contract?",
    a: "No, cancel anytime.",
  },
  {
    q: "How does the AI content work?",
    a: "AI generates copy based on your brand info.",
  },
];

const ForVendors = () => {
  return (
    <div className="min-h-screen bg-background text-foreground topo-card">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-background px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">
              For Van Life Brands
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Your Van Life Business.{" "}
              <span className="text-primary">Powered by Vanciety.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
              Join 1,000+ van life brands already on the platform. Get found by
              100,000+ van lifers. No website needed.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-amber-500"
              >
                <Link to={VENDOR_CTA}>List Your Company Free →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="bg-gray-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {valueProps.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="border-gray-800 bg-background text-foreground topo-card"
                >
                  <CardContent className="p-8">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-gray-400">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white px-6 py-20 text-gray-900">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Start free. Upgrade when you are ready to grow.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col bg-white ${
                    tier.popular
                      ? "border-2 border-primary shadow-lg"
                      : "border border-gray-200"
                  }`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground hover:bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="flex flex-1 flex-col p-8">
                    <h3 className="text-sm font-bold tracking-widest text-gray-500">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">
                      {tier.price}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`mt-8 w-full ${
                        tier.popular
                          ? "bg-primary text-primary-foreground hover:bg-amber-500"
                          : "bg-gray-900 text-foreground hover:bg-gray-800"
                      }`}
                    >
                      <a href={tier.href}>{tier.cta}</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="bg-background px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Trusted by brands you know
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="text-lg font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card
                  key={t.name}
                  className="border-gray-800 bg-gray-900 text-foreground"
                >
                  <CardContent className="p-8">
                    <Quote className="h-8 w-8 text-primary" />
                    <p className="mt-4 text-gray-300">{t.quote}</p>
                    <div className="mt-6">
                      <p className="font-semibold text-foreground">{t.name}</p>
                      <p className="text-sm text-primary">{t.company}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                From signup to leads in four simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              {steps.map(({ icon: Icon, title }, index) => (
                <div key={title} className="text-center">
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-gray-950">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${index}`}
                  className="border-gray-800"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-lime-500 to-lime-600 px-6 py-20 text-gray-950">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to grow your van life business?
            </h2>
            <p className="mt-4 text-lg text-gray-900/80">
              List your company free and start reaching 100,000+ van lifers
              today.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground topo-card hover:bg-gray-800"
              >
                <Link to={VENDOR_CTA} className="inline-flex items-center gap-2">
                  List Your Company Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForVendors;
