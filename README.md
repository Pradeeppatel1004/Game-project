# UrbanCart — Shopping Platform

Build an e-commerce shopping platform from scratch using vanilla JavaScript, HTML, and CSS.

## Live Demo

[View the finished product](#) <!-- Link will be updated after deployment -->

Use the live demo to understand how the finished product should look and work. Explore every page, try every feature, and pay attention to the details.

## Setup

1. Navigate to this directory in your terminal
2. Run `npx serve .` to start a local dev server
3. Open the URL shown in your terminal (usually `http://localhost:3000`)

> **Note:** You must use a local server (not open the HTML file directly) because `fetch()` doesn't work with the `file://` protocol.

## Pages

| Page | File | Description |
|------|------|-------------|
| Shop | `index.html` | Product listing with search, category filtering, sorting, and pagination |
| Product | `product.html` | Product detail with image gallery, reviews, and add to cart |
| Cart | `cart.html` | Shopping cart with quantity controls, promo codes, and order summary |
| Checkout | `checkout.html` | Shipping and payment forms with validation |
| Confirmation | `confirmation.html` | Order confirmed with order number and summary |

## API

This project uses the **DummyJSON API** — a free, external REST API that returns real product data. There are no local data files to manage; your JavaScript code makes real `fetch()` requests to a live server.

| Endpoint | Returns |
|----------|---------|
| `https://dummyjson.com/products?limit=20&skip=0` | Paginated product list |
| `https://dummyjson.com/products/{id}` | Single product by ID |
| `https://dummyjson.com/products/search?q={query}` | Search products by keyword |
| `https://dummyjson.com/products/category-list` | All category names |
| `https://dummyjson.com/products/category/{name}` | Products in a specific category |

> **Tip:** Open these URLs directly in your browser to see the JSON response structure before writing any code.

## Guide

Open **`CONCEPTS.md`** for feature descriptions and progressive hints.

The hints are organized in 3 levels:
- **Level 1** (visible) — Feature description that hints at what to build
- **Level 2** (expandable) — Thinking questions to guide your approach
- **Level 3** (expandable) — Direct concept names when you're stuck

Try to solve each feature using only Level 1 first!
