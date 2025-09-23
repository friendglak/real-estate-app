/**
 * Utility functions to handle hydration issues
 */

/**
 * Check if we're running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if we're running on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Safely access window object with fallback
 */
export function safeWindow<T>(fn: () => T, fallback: T): T {
  try {
    return isClient() ? fn() : fallback
  } catch {
    return fallback
  }
}

/**
 * Check if hydration is complete
 */
export function useHydration() {
  if (isServer()) {
    return false
  }
  
  // Check if React has finished hydrating
  return document.readyState === 'complete'
}

/**
 * Wait for hydration to complete
 */
export function waitForHydration(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isServer()) {
      resolve(false)
      return
    }

    if (document.readyState === 'complete') {
      resolve(true)
      return
    }

    const checkHydration = () => {
      if (document.readyState === 'complete') {
        resolve(true)
      } else {
        setTimeout(checkHydration, 100)
      }
    }

    checkHydration()
  })
}

/**
 * Suppress hydration warnings for known browser extension attributes
 */
export function suppressHydrationWarning() {
  if (isClient()) {
    // Remove common browser extension attributes that cause hydration issues
    const body = document.body
    if (body) {
      const extensionAttributes = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm_editor',
      ]
      
      extensionAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr)
        }
      })
    }
  }
}

