import Header from "@/components/Header";
import AIVanConcierge from "@/components/AIVanConcierge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  affiliateCollections,
  designDrops,
  storefrontCategories,
  storefrontIcons,
  storefrontStats,
  storefrontVideos,
} from "@/data/vancietyStorefront";
import { ArrowRight, ExternalLink, Lock, Palette, PlayCircle, Shirt, ShoppingBag, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const { Flame, Car, Mountain, TentTree } = storefrontIcons;

const VancietyShop = () => {
  const [activePrompt, setActivePrompt] = useState(designDrops[0]?.prompt || "");

  const promptPreview = useMemo(() => {
    const cleaned = activePrompt.trim();
    if (!cleaned) return "Choose a drop or write a design brief to generate the next vanlife product concept.";
    return cleaned.length > 280 ? `${cleaned.slice(0, 280)}...` : cleaned;
  }, [activePrompt]);

  return (
    <div className="vanciety-page vanciety-page--marketplace min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="vanciety-hero-topo relative overflow-hidden py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary-glow" variant="outline">
                Vanciety Storefront OS
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
                Vanlife merch, affiliate gear, and AI-designed drops in one shop.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                A Vanciety commerce layer for Sprinter owners: topo shirts, camp patches, van dog gear, digital guides,
                trusted affiliate categories, product videos, and an AI design lab that can turn member ideas into drops.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <a href="#design-lab">
                    Open design lab
                    <Sparkles className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#collections">
                    Browse collections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Card className="vanciety-topo-card border-border/80 bg-card/90 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Drop builder preview</CardTitle>
                    <CardDescription>Concept-to-product flow for Vanciety merch.</CardDescription>
                  </div>
                  <div className="rounded-2xl bg-primary/12 p-3 text-primary-glow">
                    <Shirt className="h-7 w-7" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {designDrops.slice(0, 3).map((drop, index) => (
                  <button
                    key={drop.id}
                    type="button"
                    onClick={() => setActivePrompt(drop.prompt)}
                    className="group w-full rounded-2xl border border-border/80 bg-background/70 p-4 text-left transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary-glow">Drop 0{index + 1}</p>
                        <h3 className="mt-1 font-bold text-foreground">{drop.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{drop.theme}</p>
                      </div>
                      <Palette className="h-5 w-5 text-muted-foreground transition group-hover:text-primary-glow" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto grid gap-4 px-4 py-10 md:grid-cols-3">
          {storefrontStats.map((stat) => (
            <Card key={stat.label} className="border-border/80 bg-card/85">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-4xl text-primary-glow">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{stat.detail}</CardContent>
            </Card>
          ))}
        </section>

        <section id="collections" className="container mx-auto px-4 py-12">
          <div className="mb-8 max-w-3xl">
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary-glow">
              Categories
            </Badge>
            <h2 className="text-3xl font-black text-foreground md:text-5xl">Everything a van owner wants, organized by intent.</h2>
            <p className="mt-4 text-muted-foreground">
              Merch, digital products, and affiliate gear live in one storefront structure. Affiliate links stay disabled until verified IDs are connected.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {storefrontCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="vanciety-topo-card border-border/80 bg-card/85">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="border-border text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {category.collectionType.replaceAll("_", " ")}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-3 border-primary/30 text-primary-glow">
                Design drops
              </Badge>
              <h2 className="text-3xl font-black text-foreground md:text-5xl">Premium vanlife product capsules.</h2>
              <p className="mt-4 text-muted-foreground">
                These drops are ready to route into Printful, Printify, Shopify, or a Supabase-backed custom checkout once provider credentials are connected.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="#design-lab">Generate another concept</a>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {designDrops.map((drop, index) => {
              const Icon = [Mountain, Campfire, Car, TentTree][index % 4];
              return (
                <Card key={drop.id} className="overflow-hidden border-border/80 bg-card/90">
                  <div className="relative min-h-56 overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(185,151,91,.35),transparent_30%),linear-gradient(135deg,rgba(12,28,23,.95),rgba(12,13,16,.98))] p-6">
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
                    <div className="relative flex h-full min-h-44 flex-col justify-between rounded-3xl border border-white/12 bg-black/22 p-5 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-glow">Vanciety drop</p>
                          <h3 className="mt-3 text-3xl font-black text-white">{drop.name}</h3>
                        </div>
                        <Icon className="h-10 w-10 text-primary-glow" />
                      </div>
                      <div>
                        <p className="text-sm text-white/75">{drop.palette}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {drop.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{drop.theme}</CardTitle>
                    <CardDescription>{drop.artDirection}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {drop.products.map((product) => (
                        <Badge key={product} variant="secondary">{product}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setActivePrompt(drop.prompt)}>
                      Load prompt into design lab
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="design-lab" className="container mx-auto grid gap-6 px-4 py-12 lg:grid-cols-[1fr_0.85fr]">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Sparkles className="h-7 w-7 text-primary-glow" />
                AI merch design lab
              </CardTitle>
              <CardDescription>
                Draft a product idea, refine the prompt, then route it to the print provider when the commerce backend is connected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={activePrompt}
                onChange={(event) => setActivePrompt(event.target.value)}
                className="min-h-44 bg-background/80"
                placeholder="Describe a vanlife shirt, sticker, patch, or accessory drop..."
              />
              <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
                <p className="mb-2 text-sm font-semibold text-primary-glow">Prompt preview</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{promptPreview}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Button variant="hero" disabled>
                  Generate art
                </Button>
                <Button variant="outline" disabled>
                  Send to print queue
                </Button>
                <Button variant="outline" disabled>
                  Publish drop
                </Button>
              </div>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                Provider credentials, model calls, and checkout stay server-side. Buttons unlock after Printful/Printify/Shopify/Supabase Commerce is configured.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle>Product video slots</CardTitle>
                <CardDescription>Short video placements for storefront conversion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {storefrontVideos.map((video) => (
                  <div key={video.id} className="rounded-2xl border border-border/80 bg-background/70 p-4">
                    <div className="flex items-start gap-3">
                      <PlayCircle className="mt-1 h-5 w-5 text-primary-glow" />
                      <div>
                        <p className="font-semibold text-foreground">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{video.use}</p>
                        <code className="mt-2 block text-xs text-primary-glow">{video.videoSlot}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <AIVanConcierge mode="marketplace" compact />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 max-w-3xl">
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary-glow">
              Affiliate engine
            </Badge>
            <h2 className="text-3xl font-black text-foreground md:text-5xl">Gear categories built for verified affiliate IDs.</h2>
            <p className="mt-4 text-muted-foreground">
              The storefront is structured for revenue, but IDs must be verified before public links go live. That prevents broken tracking and keeps recommendations honest.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {affiliateCollections.map((collection) => (
              <Card key={collection.id} className="border-border/80 bg-card/85">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{collection.title}</CardTitle>
                      <CardDescription>{collection.buyerIntent}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300">
                      Needs ID
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {collection.categories.map((item) => (
                      <Badge key={item} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background/70 p-4 text-sm">
                    <p className="font-semibold text-foreground">Affiliate slot</p>
                    <code className="mt-1 block text-primary-glow">{collection.affiliateSlot}</code>
                    <p className="mt-2 text-muted-foreground">{collection.note}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 pb-20">
          <Card className="vanciety-topo-card border-primary/20 bg-primary/10">
            <CardContent className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-black text-foreground">Next: connect provider accounts and publish the first drop.</h2>
                <p className="mt-3 text-muted-foreground">
                  Print provider, affiliate IDs, checkout, tax/shipping rules, product video uploads, and member voting are the remaining production pieces.
                </p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <a href="/van-intelligence#products">
                  Research gear stack
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default VancietyShop;
