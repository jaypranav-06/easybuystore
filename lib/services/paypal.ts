/**
 * PAYPAL PAYMENT INTEGRATION SERVICE
 *
 * This file handles integration with PayPal's REST API for payment processing.
 * It provides functions to create orders, capture payments, and manage transactions.
 *
 * Key Concepts:
 * - PayPal REST API: Modern API for processing payments
 * - OAuth 2.0: Authentication mechanism using access tokens
 * - Sandbox vs Live: Testing environment vs production environment
 * - Order Intent: CAPTURE means immediate payment (vs AUTHORIZE for delayed capture)
 *
 * Payment Flow:
 * 1. Create order (createPayPalOrder) - Customer initiates checkout
 * 2. Customer approves payment on PayPal's site
 * 3. Capture order (capturePayPalOrder) - Money is transferred to merchant
 * 4. Extract transaction details for database storage
 *
 * Reference: https://developer.paypal.com/api/rest/
 */

/**
 * PAYPAL CONFIGURATION INTERFACE
 *
 * Defines the structure of PayPal configuration settings.
 *
 * Properties:
 * - clientId: Public identifier for your PayPal app
 * - clientSecret: Secret key for authentication (keep secure!)
 * - mode: 'sandbox' for testing, 'live' for production
 * - apiUrl: Base URL for PayPal API calls (different for sandbox/live)
 */
export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
  apiUrl: string;
}

/**
 * GET PAYPAL CONFIGURATION
 *
 * Loads PayPal credentials and settings from environment variables.
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_PAYPAL_CLIENT_ID: Your PayPal app client ID (public, can be in browser)
 * - PAYPAL_CLIENT_SECRET: Your PayPal app secret (private, server-side only!)
 * - PAYPAL_MODE: 'live' for production, defaults to 'sandbox' for testing
 *
 * Security Note:
 * - Client ID (NEXT_PUBLIC_*) is safe to expose in frontend code
 * - Client Secret must NEVER be sent to the browser - server-side only!
 *
 * Sandbox vs Live:
 * - Sandbox: Test with fake money, use test accounts from PayPal Developer Dashboard
 * - Live: Real money transactions, requires business verification
 *
 * @returns PayPal configuration object
 * @throws Error if credentials are missing
 */
export function getPayPalConfig(): PayPalConfig {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';

  // Validate that credentials are configured
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env');
  }

  // Use different API URLs for sandbox vs production
  const apiUrl = mode === 'live'
    ? 'https://api-m.paypal.com'           // Production API
    : 'https://api-m.sandbox.paypal.com';  // Testing API

  return {
    clientId,
    clientSecret,
    mode,
    apiUrl,
  };
}

/**
 * GET PAYPAL OAUTH ACCESS TOKEN
 *
 * Authenticates with PayPal and retrieves an access token for API calls.
 * This token is required for all subsequent PayPal API requests.
 *
 * How OAuth 2.0 Client Credentials Flow Works:
 * 1. Encode clientId:clientSecret as Base64
 * 2. Send to PayPal's OAuth endpoint with Basic authentication
 * 3. Receive temporary access token (valid for ~9 hours)
 * 4. Use token in Authorization header for API calls
 *
 * Security:
 * - This function should only run on the server (never in browser)
 * - Access tokens are temporary and expire
 * - Each API call can request a new token or cache existing ones
 *
 * Reference: https://developer.paypal.com/api/rest/authentication/
 *
 * @returns Access token string for API authorization
 * @throws Error if authentication fails
 */
export async function getPayPalAccessToken(): Promise<string> {
  const config = getPayPalConfig();

  // Create Base64-encoded authentication string: "clientId:clientSecret"
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  // Request access token using OAuth 2.0 client credentials flow
  const response = await fetch(`${config.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,  // Basic authentication with encoded credentials
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',  // OAuth grant type
  });

  // Handle authentication errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal authentication failed: ${error.error_description || error.error}`);
  }

  const data = await response.json();
  return data.access_token;  // Return the token for use in API calls
}

/**
 * CREATE ORDER PARAMETERS INTERFACE
 *
 * Defines the structure for creating a new PayPal order.
 *
 * Parameters:
 * - amount: Total order amount (in currency units)
 * - currency: Currency code (default: 'USD'), e.g., 'LKR', 'EUR', 'GBP'
 * - referenceId: Your internal order/reference ID
 * - items: Optional array of line items for detailed invoice
 * - returnUrl: Where to redirect after successful payment
 * - cancelUrl: Where to redirect if customer cancels
 */
export interface CreateOrderParams {
  amount: number;
  currency?: string;
  referenceId?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  returnUrl?: string;
  cancelUrl?: string;
}

/**
 * CREATE PAYPAL ORDER
 *
 * Creates a new PayPal order that the customer can approve and pay for.
 * This is step 1 of the PayPal payment flow.
 *
 * Payment Flow:
 * 1. Call this function to create order → Get order ID
 * 2. Redirect customer to PayPal using approve link
 * 3. Customer logs in to PayPal and approves payment
 * 4. Customer redirected back to returnUrl
 * 5. Call capturePayPalOrder() to complete the transaction
 *
 * Intent: CAPTURE
 * - CAPTURE: Money is transferred immediately upon approval
 * - AUTHORIZE: Money is only held, requires separate capture call
 *
 * Application Context:
 * - brand_name: Shows "EasyBuyStore" in PayPal checkout
 * - user_action: "PAY_NOW" shows final amount immediately
 *
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_create
 *
 * @param params - Order creation parameters
 * @returns PayPal order object with order ID and approve link
 * @throws Error if order creation fails
 */
export async function createPayPalOrder(params: CreateOrderParams) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const {
    amount,
    currency = 'USD',
    referenceId = 'default',
    items,
    returnUrl = `${process.env.NEXTAUTH_URL}/checkout/success`,
    cancelUrl = `${process.env.NEXTAUTH_URL}/checkout/cancel`,
  } = params;

  // Build PayPal order request body
  const requestBody: any = {
    intent: 'CAPTURE',  // Money transferred immediately upon approval
    purchase_units: [
      {
        reference_id: referenceId,  // Your internal order reference
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),  // Amount with 2 decimal places
        },
      },
    ],
    application_context: {
      return_url: returnUrl,  // Where customer goes after successful payment
      cancel_url: cancelUrl,   // Where customer goes if they cancel
      brand_name: 'EasyBuyStore',  // Your brand name shown in PayPal checkout
      landing_page: 'NO_PREFERENCE',  // Let PayPal decide login vs guest checkout
      user_action: 'PAY_NOW',  // Shows "Pay Now" button (vs "Continue")
    },
  };

  // Add line items if provided (optional, for detailed invoice)
  if (items && items.length > 0) {
    requestBody.purchase_units[0].items = items.map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: currency,
        value: item.unit_amount.toFixed(2),
      },
    }));

    // Add amount breakdown to show item total
    requestBody.purchase_units[0].amount.breakdown = {
      item_total: {
        currency_code: currency,
        value: amount.toFixed(2),
      },
    };
  }

  // Call PayPal API to create the order
  const response = await fetch(`${config.apiUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,  // Use OAuth token for authentication
    },
    body: JSON.stringify(requestBody),
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal order creation failed: ${error.message || JSON.stringify(error)}`);
  }

  // Return order object containing order ID and approve link
  return await response.json();
}

/**
 * CAPTURE PAYPAL ORDER
 *
 * Completes the payment and transfers money from customer to merchant.
 * This is step 2 of the PayPal payment flow (after customer approves).
 *
 * When to Call:
 * - After customer approves payment on PayPal's site
 * - Customer is redirected back to your returnUrl with order ID
 * - Extract order ID from URL and call this function
 *
 * What Happens:
 * 1. PayPal validates the approved order
 * 2. Money is transferred from customer's PayPal to merchant account
 * 3. Transaction details are returned (transaction ID, amount, payer info)
 * 4. Order status changes from APPROVED to COMPLETED
 *
 * Important:
 * - Can only capture an order once
 * - Order must be in APPROVED status
 * - Capture must happen within 3 hours of approval (PayPal limit)
 *
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 *
 * @param orderId - The PayPal order ID to capture
 * @returns Capture response with transaction details
 * @throws Error if capture fails
 */
export async function capturePayPalOrder(orderId: string) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  // Call PayPal API to capture the approved order
  const response = await fetch(
    `${config.apiUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  // Handle errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal order capture failed: ${error.message || JSON.stringify(error)}`);
  }

  // Return capture details (transaction ID, payer info, amount, etc.)
  return await response.json();
}

/**
 * GET PAYPAL ORDER DETAILS
 *
 * Retrieves full details of a PayPal order by order ID.
 * Useful for checking order status and getting payment information.
 *
 * Use Cases:
 * - Check if order was approved by customer
 * - Verify order status before capturing
 * - Get customer information
 * - Debug payment issues
 *
 * Order Statuses:
 * - CREATED: Order created, waiting for customer approval
 * - APPROVED: Customer approved, ready to capture
 * - COMPLETED: Payment captured successfully
 * - VOIDED: Order cancelled
 *
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_get
 *
 * @param orderId - The PayPal order ID
 * @returns Order details object with status, payer info, amounts
 * @throws Error if order not found or API call fails
 */
export async function getPayPalOrderDetails(orderId: string) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${config.apiUrl}/v2/checkout/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get PayPal order details: ${error.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * EXTRACT TRANSACTION DETAILS
 *
 * Parses the capture response to extract important transaction information
 * in a clean, easy-to-use format for database storage.
 *
 * What It Extracts:
 * - Transaction ID (for payment tracking)
 * - Transaction status (COMPLETED, PENDING, etc.)
 * - Amount and currency
 * - Payer information (email, name, PayPal ID)
 * - Timestamps (creation and update times)
 *
 * Use Case:
 * After capturing a payment, use this to extract data for saving to your database.
 *
 * @param captureData - The capture response from capturePayPalOrder()
 * @returns Formatted transaction details object
 */
export function extractTransactionDetails(captureData: any) {
  // Navigate to the capture object within the response
  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    transactionId: capture?.id,  // Unique PayPal transaction ID
    status: capture?.status,      // COMPLETED, PENDING, REFUNDED, etc.
    amount: capture?.amount?.value,
    currency: capture?.amount?.currency_code,
    payer: {
      email: captureData.payer?.email_address,
      payerId: captureData.payer?.payer_id,
      name: {
        givenName: captureData.payer?.name?.given_name,
        surname: captureData.payer?.name?.surname,
        fullName: `${captureData.payer?.name?.given_name || ''} ${captureData.payer?.name?.surname || ''}`.trim(),
      },
    },
    createTime: capture?.create_time,  // When payment was captured
    updateTime: capture?.update_time,  // Last update time
  };
}

/**
 * GET APPROVE LINK
 *
 * Extracts the customer approval URL from order creation response.
 * This is the link where you redirect the customer to approve payment.
 *
 * How It Works:
 * - PayPal returns multiple links in the response (self, approve, capture)
 * - We find the one with rel="approve"
 * - This link takes customer to PayPal's checkout page
 *
 * Usage Example:
 * ```
 * const order = await createPayPalOrder({ amount: 100 });
 * const approveUrl = getApproveLink(order);
 * redirect(approveUrl);  // Send customer to PayPal
 * ```
 *
 * @param orderData - Response from createPayPalOrder()
 * @returns Approval URL or null if not found
 */
export function getApproveLink(orderData: any): string | null {
  const approveLink = orderData.links?.find((link: any) => link.rel === 'approve');
  return approveLink?.href || null;
}
