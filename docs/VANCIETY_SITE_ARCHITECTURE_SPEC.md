# Vanciety Site Architecture Spec

Source: User-provided recommendations (June 17, 2026)

## Core Principle

One sentence: the complete marketplace and community for vanlife and off-road.

Three paths: Buy | Sell | Learn

Five hero entry points: Buy Parts | Sell an Item | 3D Print Files | Brands & Makers | Community Resources

## Navigation (short and obvious)

| Label | Route | Notes |
|---|---|---|
| Marketplace | /marketplace | Dropdown: Buy Parts, Sell an Item, Used Gear, 3D Files |
| Learn | /videos | Dropdown: Guides & Builds, How-Tos, Product Reviews, Van Intel |
| Events | /news | Direct |
| Map | /map | Direct |
| Community | /forum | Dropdown: Forum, Friend Finder, Members |
| Vanny | /ai | Direct — AI assistant |
| Account | /auth or /van-cards | Direct |

## Page Naming System

| Old idea | New name |
|---|---|
| Shop | Buy Parts |
| Sell | Sell an Item |
| Categories | Shop by Category |
| Vendors | Brands & Makers |
| Files | 3D Print Files |
| Used gear | Used Gear |
| Forums / blog | Guides & Builds |
| Account | My Account |
| Listings | My Listings |
| Support | Help Center |

## Site Architecture

### Public Layer
Home, Search, Categories, Brands, Guides, Videos, Reviews, Events, About, Sign Up / Log In

### Member Layer
Member Dashboard, Saved Items, My Listings, My Reviews, Messages, My Events, My Profile, Member Map, Nearby Members, Verified Sellers

### Marketplace Layer
Buy Parts, Sell Items, Used Gear, 3D Print Files, Tools, Electrical, Solar, Plumbing, Paint, Mechanics, Services, Rentals

### Knowledge Layer
How-To Guides, Build Logs, Product Reviews, Business Reviews, Manufacturer Pages, Mechanic Directory, Tool Lists, Documents / PDFs, FAQ / Safety Help

## User Flow

Home → choose major path → filter results → open listing → message seller or buy → checkout or inquiry

## Home Page

- Hero with one-sentence value statement
- Search bar
- Category chips
- Featured listings
- Featured reviews
- Events preview
- Member/community preview
- Vanny entry

## Privacy Spec

### Location Levels
- Off (default for new users)
- Approximate region only (basic members)
- Nearby members visible (verified members, opt-in)
- Exact (admins only, specific safety use cases)

### Permission Matrix

| Role | Browse | Post | Sell | See Map | Appear on Map | Exact Location |
|---|---|---|---|---|---|---|
| Guest | Yes | No | No | No | No | No |
| Member | Yes | Limited | Limited | Yes (logged in) | Optional | No |
| Verified Member | Yes | Yes | Yes | Yes | Opt-in | No |
| Seller | Yes | Yes | Yes | Yes | Opt-in | No |
| Business | Yes | Yes | Yes | Yes | Region only | No |
| Moderator/Admin | Yes | Yes | Yes | Yes | As needed | Limited |

## Recommended First Release

Home, Search, Categories, Listings, Reviews, Events, Member Profiles, Member Map (opt-in privacy), Vanny assistant, Sell Flow, Basic Verification

## Status

- [ ] Navigation restructure
- [ ] Hero with 5 entry points
- [ ] Marketplace Buy/Sell split
- [ ] Seller flow pages
- [ ] Category-first browse
- [ ] Search + filters
- [ ] Verification tiers
