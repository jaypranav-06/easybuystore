/**
 * ADMIN AUTHENTICATION UTILITIES
 *
 * This file handles admin-specific authentication using JWT tokens stored in cookies.
 * It provides utility functions to verify admin users and check their authentication status.
 *
 * Key Concepts:
 * - JWT (JSON Web Token): A secure token that contains admin user information
 * - Cookie-based auth: JWT token is stored in an HTTP cookie for security
 * - jose: Library for verifying and decoding JWT tokens
 * - Type safety: TypeScript interface ensures admin data structure is consistent
 */

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

/**
 * JWT SECRET KEY
 *
 * Used to verify that JWT tokens are authentic and haven't been tampered with.
 * Must match the secret used when creating the tokens.
 * Converts the secret string to bytes format required by jose library.
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

/**
 * ADMIN USER INTERFACE
 *
 * Defines the structure of admin user data returned from token verification.
 *
 * Properties:
 * - id: Unique admin identifier
 * - email: Admin email address
 * - username: Admin username
 * - role: Admin role (admin, staff, super_admin)
 * - type: Always 'admin' to distinguish from regular users
 */
export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
  type: 'admin';
}

/**
 * GET ADMIN FROM COOKIE
 *
 * Retrieves and verifies admin user information from the 'admin-token' cookie.
 *
 * Process:
 * 1. Read the 'admin-token' cookie from the request
 * 2. Verify the JWT token using the secret key
 * 3. Check that the token type is 'admin'
 * 4. Extract admin data from the token payload
 * 5. Return admin user object or null if verification fails
 *
 * Returns:
 * - AdminUser object if token is valid and user is admin
 * - null if no token, invalid token, or not an admin type
 *
 * Error Handling:
 * - Catches any verification errors and returns null
 * - Logs errors to console for debugging
 */
export async function getAdminFromCookie(): Promise<AdminUser | null> {
  try {
    // Get the cookie store from Next.js
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token');

    // No token found - user is not logged in as admin
    if (!token) {
      return null;
    }

    // Verify the JWT token and extract the payload
    // jwtVerify throws an error if token is invalid or expired
    const { payload } = await jwtVerify(token.value, JWT_SECRET);

    // Ensure this token is specifically for admin users
    if (payload.type !== 'admin') {
      return null;
    }

    // Return the admin user data from the token payload
    return {
      id: payload.id as number,
      email: payload.email as string,
      username: payload.username as string,
      role: payload.role as string,
      type: 'admin',
    };
  } catch (error) {
    // Log the error for debugging (token expired, invalid signature, etc.)
    console.error('Error verifying admin token:', error);
    return null;
  }
}

/**
 * IS ADMIN AUTHENTICATED
 *
 * Simple helper function to check if an admin user is currently authenticated.
 *
 * Returns:
 * - true if valid admin token exists
 * - false if no token or invalid token
 *
 * Usage:
 * Used in middleware and page components to quickly check admin auth status
 * without needing the full admin user object.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getAdminFromCookie();
  return admin !== null;
}
