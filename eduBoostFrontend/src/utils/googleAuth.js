/**
 * Google OAuth utility functions
 * Uses Google Identity Services (GIS) API for sign-in
 */

/**
 * Initialize Google Sign-In
 * @param {string} clientId - Google OAuth Client ID
 * @returns {Promise<void>}
 */
export const initGoogleSignIn = (clientId) => {
    return new Promise((resolve, reject) => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: () => {}, // Will be handled by signInWithGoogle
            });
            resolve();
        } else {
            // Wait for Google script to load
            const checkGoogle = setInterval(() => {
                if (window.google) {
                    clearInterval(checkGoogle);
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: () => {},
                    });
                    resolve();
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkGoogle);
                reject(new Error('Google Sign-In script failed to load'));
            }, 10000);
        }
    });
};

/**
 * Sign in with Google using popup
 * @param {string} clientId - Google OAuth Client ID
 * @returns {Promise<string>} - Returns the ID token
 */
export const signInWithGoogle = (clientId) => {
    return new Promise((resolve, reject) => {
        if (!window.google) {
            reject(new Error('Google Sign-In script not loaded'));
            return;
        }

        // Initialize if not already done
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
                if (response.credential) {
                    resolve(response.credential);
                } else {
                    reject(new Error('No credential received from Google'));
                }
            },
        });

        // Trigger the sign-in popup
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // If prompt is not displayed, use oneTap
                window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'email profile',
                    callback: (tokenResponse) => {
                        if (tokenResponse.access_token) {
                            // Get user info and then get ID token
                            fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`)
                                .then(res => res.json())
                                .then(() => {
                                    // For popup flow, we'll use the oneTap flow instead
                                    window.google.accounts.id.prompt();
                                })
                                .catch(reject);
                        } else {
                            reject(new Error('Failed to get access token'));
                        }
                    },
                }).requestAccessToken();
            }
        });

        // Alternative: Use popup directly
        window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'openid email profile',
            callback: async (tokenResponse) => {
                if (tokenResponse.error) {
                    reject(new Error(tokenResponse.error));
                    return;
                }
                
                // Get user info to verify
                try {
                    const userInfo = await fetch(
                        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
                    ).then(res => res.json());
                    
                    // For ID token, we need to use a different approach
                    // Since we're using OAuth2 flow, we'll need to exchange for ID token
                    // For simplicity, we'll use the access token approach or switch to oneTap
                    reject(new Error('Please use One Tap or redirect flow for ID token'));
                } catch (error) {
                    reject(error);
                }
            },
        }).requestAccessToken();
    });
};

/**
 * Sign in with Google using One Tap (recommended)
 * @param {string} clientId - Google OAuth Client ID
 * @returns {Promise<string>} - Returns the ID token
 */
export const signInWithGoogleOneTap = (clientId) => {
    return new Promise((resolve, reject) => {
        if (!window.google) {
            reject(new Error('Google Sign-In script not loaded'));
            return;
        }

        let resolved = false;

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
                if (!resolved && response.credential) {
                    resolved = true;
                    resolve(response.credential);
                }
            },
        });

        // Show One Tap
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // If One Tap is not available, fall back to button click
                if (!resolved) {
                    reject(new Error('One Tap not available. Please use button sign-in.'));
                }
            }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                reject(new Error('Google sign-in timeout'));
            }
        }, 30000);
    });
};

/**
 * Sign in with Google using button (most reliable)
 * This should be called when user clicks the Google button
 * @param {string} clientId - Google OAuth Client ID
 * @returns {Promise<string>} - Returns the ID token
 */
export const signInWithGoogleButton = (clientId) => {
    return new Promise((resolve, reject) => {
        if (!window.google) {
            reject(new Error('Google Sign-In script not loaded'));
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
                if (response.credential) {
                    resolve(response.credential);
                } else {
                    reject(new Error('No credential received from Google'));
                }
            },
        });

        // This will be triggered by the button click
        // The button should have data-client_id and data-callback attributes
    });
};
