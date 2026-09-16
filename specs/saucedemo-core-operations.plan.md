# SauceDemo Core End-User Operations Test Plan

## Application Overview

Functional UI test plan for the SauceDemo Swag Labs e-commerce demo at https://www.saucedemo.com. The plan covers five independent operations a typical end user performs: authenticate, browse and select a product, manage the shopping cart, complete checkout, and end the session. Each test starts from a fresh browser state and uses the published demo credentials standard_user / secret_sauce unless the scenario intentionally tests validation.

## Test Scenarios

### 1. Core End-User Operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with valid credentials and reject invalid credentials

**File:** `tests/saucedemo-core/sign-in.spec.js`

**Steps:**
  1. Start from a fresh browser state and navigate to https://www.saucedemo.com.
    - expect: The Swag Labs login page is displayed with Username, Password, and Login controls.
    - expect: Failure if the login form or either input is missing.
  2. Enter username standard_user and password secret_sauce, then click Login.
    - expect: The user is redirected to /inventory.html.
    - expect: The Products page heading and product catalog are visible.
    - expect: The cart indicator is empty.
    - expect: Failure if the user remains on the login page or an authentication error appears.
  3. Reset to a fresh browser state, enter an invalid username or password, and click Login.
    - expect: The user remains on the login page.
    - expect: A visible authentication error is displayed and no inventory page is opened.
    - expect: Failure if invalid credentials grant access.

#### 1.2. Browse, sort, and inspect a product before selecting it

**File:** `tests/saucedemo-core/browse-products.spec.js`

**Steps:**
  1. Start from a fresh browser state, sign in as standard_user with password secret_sauce, and open the Products page.
    - expect: Six products are visible, including Sauce Labs Backpack and Sauce Labs Bike Light.
    - expect: The Sort products control is present and initially shows Name (A to Z).
  2. Change Sort products to Price (low to high).
    - expect: The catalog order changes so Sauce Labs Onesie at $7.99 appears before Sauce Labs Bike Light at $9.99.
    - expect: Failure if the selected sort option is not applied to the visible order.
  3. Open the Sauce Labs Backpack product details.
    - expect: The detail page shows the product name, description, image, price $29.99, Add to cart control, and Back to products control.
    - expect: Failure if product information is missing or inconsistent with the catalog.
  4. Use Back to products and select the Name (Z to A) sort option.
    - expect: The user returns to the catalog and the product order changes to descending name order.
    - expect: Failure if navigation back or sorting does not work.

#### 1.3. Add, review, and remove products from the cart

**File:** `tests/saucedemo-core/manage-cart.spec.js`

**Steps:**
  1. Start from a fresh browser state, sign in, and open the Products page.
    - expect: The cart indicator is empty and no product is selected.
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    - expect: The cart indicator shows 2 items.
    - expect: Each product changes from Add to cart to Remove, or otherwise exposes an equivalent selected state.
    - expect: Failure if the count does not match the two selected products.
  3. Open the cart.
    - expect: The cart page lists exactly the Backpack and Bike Light with quantity 1 each.
    - expect: Continue Shopping and Checkout controls are visible.
    - expect: Failure if a selected item is missing, duplicated, or has the wrong quantity.
  4. Remove the Bike Light from the cart, then return to the cart if necessary.
    - expect: Only the Backpack remains and the cart indicator shows 1 item.
    - expect: Failure if the removed item remains or the count is stale.
  5. Remove the Backpack and open the cart.
    - expect: The cart is empty and the cart indicator shows empty or 0 items.
    - expect: Checkout is unavailable or cannot proceed with no items.
    - expect: Failure if an empty cart contains an item or allows a completed order.

#### 1.4. Complete a purchase and validate checkout errors

**File:** `tests/saucedemo-core/checkout-order.spec.js`

**Steps:**
  1. Start from a fresh browser state, sign in, add Sauce Labs Backpack, open the cart, and click Checkout.
    - expect: The Checkout: Your Information page opens with First Name, Last Name, Zip/Postal Code, Cancel, and Continue controls.
  2. Leave all checkout fields blank and click Continue.
    - expect: The user remains on the information page.
    - expect: A visible error states First Name is required.
    - expect: Failure if the form advances with missing required information.
  3. Enter Test, Customer, and 12345 in First Name, Last Name, and Zip/Postal Code, then click Continue.
    - expect: The Checkout: Overview page opens.
    - expect: The Backpack is listed at quantity 1 and $29.99.
    - expect: Payment information, shipping information, item total $29.99, tax $2.40, and total $32.39 are displayed.
    - expect: Cancel and Finish controls are visible.
    - expect: Failure if item, tax, or total calculations are incorrect.
  4. Click Finish.
    - expect: The Checkout: Complete! page opens.
    - expect: The page displays Thank you for your order! and the dispatch message.
    - expect: The cart indicator is empty.
    - expect: Failure if the order is not completed or the cart still contains the purchased item.

#### 1.5. Log out and verify the session is closed

**File:** `tests/saucedemo-core/logout.spec.js`

**Steps:**
  1. Start from a fresh browser state, sign in as standard_user, and confirm the Products page is visible.
    - expect: The authenticated inventory page is displayed with the Open Menu control.
  2. Open the menu and click Logout.
    - expect: The user is redirected to the Swag Labs login page.
    - expect: Username, Password, and Login controls are visible.
    - expect: Failure if the authenticated catalog remains accessible after logout.
  3. Attempt to navigate directly to https://www.saucedemo.com/inventory.html without signing in again.
    - expect: The application does not expose the inventory to the logged-out session and redirects to or presents the login page.
    - expect: Failure if a logged-out user can access the product catalog.
