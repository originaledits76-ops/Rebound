let cgSDK = null;
let adFrequencyCounter = 0;
let sdkInitialized = false;

export async function initCrazyGamesSDK() {
    if (sdkInitialized) return;
    sdkInitialized = true;

    try {
        if (window.CrazyGames && window.CrazyGames.SDK) {
            await window.CrazyGames.SDK.init();
            cgSDK = window.CrazyGames.SDK;
            console.log("[CrazyGames] SDK initialized successfully");
            
            if (cgSDK && cgSDK.game) {
                cgSDK.game.loadingStart();
            }
        } else {
            console.log("[CrazyGames] Running in standalone/preview mode (CrazyGames SDK not present). Using fallbacks.");
        }
    } catch (error) {
        console.warn("[CrazyGames] SDK init skipped:", error ? (error.message || error) : 'unknown error');
    }
}

export function onAssetsLoaded() {
    if (cgSDK && cgSDK.game) {
        try {
            cgSDK.game.loadingStop();
        } catch (e) {
            console.warn("[CrazyGames] loadingStop failed:", e);
        }
    }
}

export async function playRewardedAd(onSuccess, onFailure) {
    if (!cgSDK || !cgSDK.ad) {
        console.log("[CrazyGames] Ad SDK not available, providing fallback reward");
        if (onSuccess) onSuccess();
        return;
    }

    try {
        if (window.game && window.game.sound) {
            window.game.sound.mute = true;
        }

        await cgSDK.ad.requestAd('rewarded', {
            adStarted: () => {
                console.log("[CrazyGames] Rewarded ad started");
            },
            adFinished: () => {
                console.log("[CrazyGames] Rewarded ad completed");
                if (window.game && window.game.sound) {
                    window.game.sound.mute = false;
                }
                if (onSuccess) onSuccess();
            },
            adError: (error) => {
                console.warn("[CrazyGames] Rewarded ad error/dismissed:", error ? (error.message || error) : 'unknown');
                if (window.game && window.game.sound) {
                    window.game.sound.mute = false;
                }
                // Provide fallback reward or trigger callback so gameplay isn't stuck
                if (onSuccess) onSuccess();
            }
        });
    } catch (e) {
        console.warn("[CrazyGames] Rewarded ad exception:", e);
        if (window.game && window.game.sound) {
            window.game.sound.mute = false;
        }
        if (onSuccess) onSuccess();
    }
}

export function trackGameActionForAds(onComplete) {
    adFrequencyCounter++;
    console.log(`[CrazyGames] Ad frequency counter: ${adFrequencyCounter}/5`);
    
    if (adFrequencyCounter >= 5) {
        adFrequencyCounter = 0;
        playMidrollAd(onComplete);
    } else {
        if (onComplete) onComplete();
    }
}

export async function playMidrollAd(onComplete) {
    if (!cgSDK || !cgSDK.ad) {
        if (onComplete) onComplete();
        return;
    }

    if (window.game && window.game.sound) {
        window.game.sound.mute = true;
    }

    try {
        await cgSDK.ad.requestAd('midroll', {
            adStarted: () => {
                console.log("[CrazyGames] Midroll ad started");
            },
            adFinished: () => {
                console.log("[CrazyGames] Midroll ad finished");
                if (window.game && window.game.sound) {
                    window.game.sound.mute = false;
                }
                if (onComplete) onComplete();
            },
            adError: (error) => {
                console.warn("[CrazyGames] Midroll ad error:", error ? (error.message || error) : 'unknown');
                if (window.game && window.game.sound) {
                    window.game.sound.mute = false;
                }
                if (onComplete) onComplete();
            }
        });
    } catch (e) {
        console.warn("[CrazyGames] Midroll ad exception:", e);
        if (window.game && window.game.sound) {
            window.game.sound.mute = false;
        }
        if (onComplete) onComplete();
    }
}

export function gameplayStart() {
    if (cgSDK && cgSDK.game) {
        try {
            cgSDK.game.gameplayStart();
        } catch (e) {
            console.warn("[CrazyGames] gameplayStart warning:", e);
        }
    }
}

export function gameplayStop() {
    if (cgSDK && cgSDK.game) {
        try {
            cgSDK.game.gameplayStop();
        } catch (e) {
            console.warn("[CrazyGames] gameplayStop warning:", e);
        }
    }
}

export function happytime() {
    if (cgSDK && cgSDK.game) {
        try {
            cgSDK.game.happytime();
        } catch (e) {
            console.warn("[CrazyGames] happytime warning:", e);
        }
    }
}

