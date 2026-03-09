# UrbanCart — Concept Guide

> This document describes what each feature should do. Read carefully —
> the way a feature is described often hints at how to build it.
>
> If you get stuck, expand the hint sections for guidance.

---

## Flow 1: Product Browsing

### 1.1 Fetching Products from an API

The shop page should display products loaded from an external API (DummyJSON). When the page loads, your code needs to request product data over the network and wait for the response before rendering anything. While the request is in-flight, show a loading indicator. If the request fails — because the network is down, the server returns an error, or something else goes wrong — the user should see a helpful message, not a blank page.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do you make a network request in JavaScript and wait for the result before continuing? What keyword lets you "pause" execution until a Promise resolves? What happens if the Promise rejects — how do you catch that?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: The `fetch()` API to make HTTP requests. Use `async/await` to wait for the response. Check `response.ok` before parsing JSON — if it is `false`, throw an error. Wrap the entire operation in a **try/catch** block so failures are handled gracefully.
</details>

---

### 1.2 Rendering Product Cards

Each product returned from the API should appear as a card showing the product image, title, price, rating, and an "Add to Cart" button. These cards must be generated entirely in JavaScript — do not write HTML cards by hand. Your code should take an array of product objects and turn each one into a visible card in the product grid.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have an array of objects. You need to transform each object into an HTML string. What array method is designed for transforming every item in an array into something new? How do you embed dynamic values (like a product's title and price) inside an HTML string?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.map()` to transform each product object into an HTML string. Use **template literals** (backtick strings with `${expression}`) to embed dynamic values. Join the resulting array with `.join('')` and set it as the grid's `innerHTML`.
</details>

---

### 1.3 Category Filtering

The shop page should display a horizontal row of category "pills" (buttons) that let users filter products by category. The category list itself should be fetched from the API — do not hardcode them. An "All Products" pill should always be present. When a user clicks a category pill, fetch that category's products from the API and update the grid. The active pill should be visually highlighted.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Rather than attaching a separate click listener to every pill button, is there a more efficient way to handle clicks on the entire pill container and figure out which pill was clicked? How do you read data stored on the clicked element to know which category it represents?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Event delegation** — attach one listener on the scroll container and use `event.target.closest('.pill')` to identify the clicked pill. Use `dataset` attributes (`data-category`) to store the category name on each pill. Use `classList.add()` and `classList.remove()` to toggle the active state.
</details>

---

### 1.4 Product Search

A search input should let users type a query to find products. As the user types, the app should search the API using its search endpoint. However, you should not fire an API request on *every single keystroke* — that would be wasteful and could overwhelm the server. Instead, the system should wait until the user pauses typing before sending the request.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How can you delay a function call so it only runs after the user stops typing for a short period? What happens to the previously scheduled call when a new keystroke arrives? This pattern requires "remembering" a timer ID between calls.
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Debouncing** — wrapping a function with `setTimeout` and `clearTimeout` so it only executes after a pause. This pattern uses **closures** to remember the timeout ID between invocations. A debounce delay of 300ms is typical.
</details>

---

### 1.5 Sorting Products

Users should be able to sort the displayed products by price (low to high, high to low), rating, or name. When the sort option changes, the same product dataset should rearrange itself without re-fetching from the API. The sorting logic should be different for each option — some compare numbers, others compare text alphabetically.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do you rearrange an array based on a comparison between pairs of items? The comparison logic changes depending on which sort option is selected. For text sorting, is there a built-in string method that handles locale-aware alphabetical comparison?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.sort()` with a custom **comparator function**. For numeric sorts: `(a, b) => a.price - b.price`. For text sorts: `a.title.localeCompare(b.title)`. Consider using a `switch` statement or an **object** keyed by sort type to pick the right comparator dynamically.
</details>

---

### 1.6 Load More Pagination

Do not load all products at once. Fetch a fixed batch (e.g., 20) on initial load. Display a "Load More" button that, when clicked, fetches the next batch and appends it to the existing grid. The button should disappear when there are no more products to load.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: The DummyJSON API accepts `skip` and `limit` parameters. If you loaded 20 products first, what `skip` value fetches the next 20? How do you combine the new batch with the products already on screen? The API response tells you the `total` count — how do you know when you have loaded everything?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: API pagination with `?limit=20&skip=0`, then `?limit=20&skip=20`, etc. Use the **spread operator** to merge arrays: `allProducts = [...allProducts, ...newBatch]`. Compare `currentSkip + limit` against `total` to decide whether to show or hide the "Load More" button.
</details>

---

### 1.7 Featured Products Section

The shop page should have a "Staff Picks" section displaying a small set of hand-picked products. These are identified by specific product IDs defined in your code. Each featured product needs to be fetched individually by ID. Since there are multiple IDs, you want to fire all the requests at the same time rather than one after another.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have an array of IDs and need to make a fetch call for each one. What array method transforms each ID into a Promise (the fetch call)? How do you wait for all of those Promises to finish before rendering the results?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.map()` to turn each ID into a `fetchProductById(id)` call, producing an array of Promises. Then use `Promise.all()` to wait for all of them to resolve. Render the results once all products have been fetched.
</details>

---

## Flow 2: Product Detail & Cart

### 2.1 Reading the Product ID from the URL

When the user clicks a product card on the shop page, they navigate to `product.html`. The product detail page needs to know *which* product was selected. The product ID should be part of the page URL so the user could bookmark or share a direct link to that product.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do websites pass small pieces of data in a URL? After the `?` in a URL, there is a standard format for key-value pairs. How can JavaScript read those values from the current page's URL?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **URL query parameters**. Set them with `?id=42` when creating the link on the shop page. Read them with `new URLSearchParams(window.location.search).get('id')` on the product page.
</details>

---

### 2.2 Image Gallery

The product detail page should display a large main image and a strip of smaller thumbnail images below it. When the user clicks a thumbnail, the main image should update to show that image. The first image should be active by default. The active thumbnail should be visually highlighted.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to generate the thumbnail strip from an array of image URLs. When a thumbnail is clicked, how do you know which image to display? Rather than attaching a click listener to every thumbnail, is there a more efficient approach? How do you store the image index on each thumbnail element?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Use `Array.map()` with **template literals** to generate the thumbnail strip HTML. Store the image index using `data-*` attributes (`data-thumb-idx`). Use **event delegation** on the thumbnail container and `event.target.closest()` to identify the clicked thumbnail. Update `img.src` on the main image and toggle `classList` for the active state.
</details>

---

### 2.3 Adding to Cart

The product page should have a quantity selector (with +/- buttons) and an "Add to Cart" button. When the user adds an item, it should be stored in an internal cart data structure. If the same product is added again, its quantity should increase rather than creating a duplicate entry. After adding, show visual feedback (e.g., button text changes briefly to "Added!").

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Your cart is an array of objects. When adding a product, you first need to check whether it is already in the array. What array method searches for an item that matches a condition? If found, update its quantity; if not, add a new entry. How do you provide temporary UI feedback that reverts after a delay?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.find()` to check for an existing item by `id`. If found, increment `item.quantity`. If not, `Array.push()` a new object. Use `setTimeout` to revert the button text after 1-2 seconds. Keep the cart data in a centralized state module (see Cross-Cutting: State Management).
</details>

---

### 2.4 Cart Persistence

The user's cart should survive page reloads and navigation between pages. Even if they close and reopen the browser, the cart should still be there. Since there is no server, you need a browser-side mechanism that persists data permanently.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: The browser has built-in storage mechanisms. One persists across sessions, the other only for the current tab. Which one fits a shopping cart? These storage mechanisms only accept text, so how do you save an array of objects? What if the storage is full or contains corrupted data?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **localStorage** for permanent storage. Use `JSON.stringify()` to save the cart array and `JSON.parse()` to retrieve it. Always wrap these operations in **try/catch** blocks because storage can be full, disabled, or contain invalid JSON.
</details>

---

### 2.5 Cart Quantity Controls

On the cart page, each item should have +/- buttons to adjust its quantity and a remove button to delete it entirely. When quantity is decreased below 1, the item should be removed. The order summary should update instantly whenever a quantity changes.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Rather than attaching separate click listeners to every button on every cart item, is there a more efficient pattern? How do you know which item a button belongs to? What array method creates a new array with a specific item removed?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Event delegation** — attach one listener on the cart items container. Use `data-*` attributes to identify the item ID and action (increase/decrease/remove). Use `Array.filter()` to remove items and `Array.find()` to locate the item for quantity updates. Use the **spread operator** (`[...items]`) when creating copies of the array.
</details>

---

### 2.6 Cart Total Calculation

The order summary should display: subtotal (sum of all items after per-item discounts), shipping (free if subtotal exceeds a threshold, otherwise a flat fee), estimated tax (a percentage of the subtotal), and the final total. Each value should update in real time as items change.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have an array of items, each with a price, discount percentage, and quantity. You need to compute a single number (the subtotal) from all of them. What array method is designed for "reducing" an array to a single accumulated value? How do you calculate a discounted price from a base price and a discount percentage?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.reduce()` to sum values — `items.reduce((sum, item) => sum + discountedPrice * item.quantity, 0)`. Calculate the discounted price as `price - (price * discountPercentage / 100)`. Use `Intl.NumberFormat` for currency formatting. Use simple arithmetic for tax: `subtotal * taxRate`.
</details>

---

### 2.7 Promo Code

Users can enter a promo code for a discount. The code should be validated against a predefined list of valid codes. Once a promo code has been applied, it cannot be applied again — the input should become disabled. Only one promo can be active at a time. The discount should reflect in the order summary immediately.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to remember whether a promo has already been applied, even across multiple clicks of the "Apply" button. What programming pattern lets a function "remember" state from previous calls without using global variables? How do you compare user input against known values while ignoring case differences?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Closures** — a factory function that returns `apply()`, `getDiscount()`, and `hasFreeShipping()` methods while enclosing private variables (like `usedCodes` and `activeDiscount`). Use `String.toUpperCase()` for case-insensitive comparison. Use `Array.includes()` to check if a code has already been used. Use **object lookup** (e.g., `PROMO_CODES[code]`) to validate codes instead of a chain of if-else statements.
</details>

---

## Flow 3: Checkout & Payment

### 3.1 Shipping Form Validation

The checkout page has a shipping form with fields for name, email, phone, address, city, state, and ZIP code. Each field should validate as the user fills it in — not just on form submission. When the user leaves a field (moves to the next one), check if the value matches the expected format and display an error message below the field if it does not.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: What event fires when a user leaves an input field? How do you test if a string matches a specific pattern — like an email that must have an `@` sign and a domain, or a ZIP code that must be exactly 5 digits? Where should you define these patterns so they are reusable across multiple fields?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: The `blur` event to trigger validation when the user leaves a field. **Regular expressions** (regex) for pattern matching — e.g., `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for email, `/^\d{5}(-\d{4})?$/` for ZIP, `/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/` for phone. Use `RegExp.test(value)` to check matches. Store patterns in a **constants** object for reuse.
</details>

---

### 3.2 Payment Form with Auto-Formatting

The payment form has a card number, cardholder name, expiry date (MM/YY), and CVV. As the user types the card number, it should automatically insert spaces every 4 digits for readability (e.g., `1234 5678 9012 3456`). The expiry field should auto-insert the `/` after the month digits. Only digits should be allowed in the card number, expiry, and CVV fields.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Formatting input as the user types means intercepting each keystroke and modifying the value. How do you strip all non-digit characters from a string? Once you have only digits, how do you insert a space every 4 characters? For the expiry field, how do you insert a `/` after the first 2 digits?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Listen to the `input` event for real-time formatting. Use `String.replace()` with **regex** to strip non-digits: `value.replace(/\D/g, '')`. For card number spacing, use `value.replace(/(\d{4})(?=\d)/g, '$1 ')`. For the expiry field, use `String.substring()` to split and recombine with a `/`. Limit input length with `String.substring(0, maxLength)`.
</details>

---

### 3.3 Order Summary

The checkout page should display a read-only sidebar showing all cart items (with thumbnails, names, quantities, and prices) and the complete price breakdown (subtotal, shipping, tax, total). This sidebar is purely informational — the user cannot modify items here.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to read the cart items from your state module and render them into the sidebar. You already know how to calculate totals from the cart page (section 2.6). How do you reuse that logic here? Each item needs its discounted price — how do you calculate it?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Use the same `Array.reduce()` pattern from the cart page for totals. Use `Array.map()` with **template literals** to render each item as HTML. Calculate discounted prices with `price - (price * discountPercentage / 100)`. Use `Intl.NumberFormat` for consistent currency formatting.
</details>

---

### 3.4 Payment Processing Simulation

After the user clicks "Place Order," first validate all form fields. If valid, disable the button, show a loading spinner in place of the button text, and simulate a processing delay. After the delay, redirect to the confirmation page. This simulates what a real payment gateway interaction would feel like.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need a delay that happens once (not repeatedly). How can you make code "wait" for a specified duration before executing the redirect? During the wait, the button should be disabled and show a spinner. How do you toggle visibility of elements?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `setTimeout` for a one-time delay (e.g., 2 seconds). Or wrap it in a **Promise** and use `async/await`: `await new Promise(resolve => setTimeout(resolve, 2000))`. Use the `hidden` attribute or `classList` to toggle the button text and spinner visibility. Set `button.disabled = true` during processing.
</details>

---

### 3.5 Order Confirmation & Ticket Generation

The confirmation page should display a unique order number and a summary of what was purchased. The order number must be unique every time — combining a timestamp with randomness ensures this. The order data (items, total) should be read from storage where the checkout page saved it.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do you generate a short, unique string? The current time in milliseconds gives uniqueness, and converting a number to a different base (like base-36) makes it compact. Adding some randomness prevents collisions if two orders happen in the same millisecond. How do you store and retrieve complex data across page navigations?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Date.now().toString(36)` for a compact timestamp string. `Math.random().toString(36).substring(2, 8)` for a random suffix. Combine them with **template literals**: `` `UC-${timestamp}-${random}` ``. Use **localStorage** to pass order data from the checkout page to the confirmation page (save before redirect, read on load).
</details>

---

### 3.6 Clearing Cart After Purchase

Once the confirmation page loads and displays the order, the cart should be emptied. All cart-related data in storage should be removed so the user starts fresh. The cart badge in the header should update to reflect zero items.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have items stored under specific keys in localStorage. How do you remove a specific key? After clearing, how do you make sure the rest of the page reflects the empty state?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `localStorage.removeItem(key)` to delete a specific key. Call your cart state's `clear()` method to empty the in-memory array and sync to storage. Update the cart badge by re-reading the count (which should now be 0) and setting the badge text accordingly.
</details>

---

## Cross-Cutting Concepts

### Rating Stars Display

Products have a numeric rating (e.g., 4.3 out of 5). Display this as a row of star icons — fully filled stars for the whole number part, a half star if the decimal is in the right range, and empty stars for the remainder. This is purely visual — the component takes a number and returns HTML.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Math.floor(rating)` for the number of full stars. Check the decimal remainder to decide if a half star is needed (e.g., 0.25-0.74 range). Calculate empty stars as `5 - fullStars - halfStars`. Use **SVG** elements or CSS for the star shapes. `String.repeat(n)` can duplicate an HTML string n times.
</details>

---

### Toast Notifications

The app should show brief, auto-dismissing notification messages (e.g., "Added to cart!", "Promo code applied!") that appear at the edge of the screen and disappear after a few seconds. Different types (success, error, info) should have different colors.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Dynamically create a `<div>` with `document.createElement()`, set its class and inner HTML, and append it to a fixed-position container. Use `setTimeout` to auto-remove after 3 seconds. Add a CSS class like `toast--removing` before removal and use **CSS transitions** for a slide-out animation. `setTimeout(() => toast.remove(), 300)` after adding the class gives the animation time to play.
</details>

---

### Page Routing

The app has 5 HTML pages. Your entry-point JavaScript file should detect which page is currently loaded and initialize only the relevant code. The body (or html) element has a `data-page` attribute to help with this.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `document.body.dataset.page` (or `document.documentElement.dataset.page`) to read the current page. Store page-init functions in an **object** keyed by page name, then call the right one: `pageMap[currentPage]?.()`. The `?.` is **optional chaining** — it safely does nothing if the key does not exist.
</details>

---

### Cart Badge

The header on every page should show a small badge on the cart icon indicating the total number of items in the cart. This badge should update dynamically whenever items are added or removed. If the cart is empty, the badge should be hidden.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Use `Array.reduce()` on the cart items to sum all `quantity` values. Update the badge element's `textContent` with the count. Use the `hidden` **attribute** to show/hide the badge: `badge.removeAttribute('hidden')` to show, `badge.setAttribute('hidden', '')` to hide. Call this update function after every cart operation.
</details>

---

### Error Handling

Every `fetch()` call can fail — the network might be down, the API might return an error, or the response might not be valid JSON. Every place in your code that calls the API should handle failure gracefully. The user should see a helpful error message, never a blank page or a console error with no explanation.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **try/catch** blocks around every `await fetch()` call. Check `response.ok` before calling `response.json()` — if it is `false`, throw an error with the status code. In the `catch` block, show user-friendly feedback (toast notification, error message in the DOM). Never let an unhandled rejection crash the page.
</details>

---

### Formatting

Prices should always display as properly formatted currency (e.g., "$49.99"), not raw numbers. Discount percentages should show as rounded whole numbers (e.g., "-17% OFF"). Dates in reviews should be human-readable. Avoid writing custom formatting logic when the browser provides built-in tools.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for currency formatting. `Math.round()` for rounding discount percentages. `Intl.DateTimeFormat` or `Date.toLocaleDateString()` for dates. Write small **utility functions** and reuse them everywhere instead of repeating formatting logic.
</details>

---

### State Management

Multiple pages and components need access to the same cart data. Rather than scattering variables everywhere or relying on reading localStorage in every function, centralize your cart state in one module with controlled access. External code should not be able to modify the cart array directly — only through defined methods.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: The **closure pattern** — a factory function (`createCartState`) that encloses a private `items` array and returns an object with methods like `getItems()`, `addItem()`, `removeItem()`, `getTotal()`, and `clear()`. The `items` array is not accessible from outside — only through the returned methods. This is also called the **revealing module pattern**. Export a single instance (singleton) for the entire app to share.
</details>
