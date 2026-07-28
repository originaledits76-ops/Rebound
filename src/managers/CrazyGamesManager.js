class CrazyGamesManagerClass {
    constructor() {
        this.initialized = false;
        this.enabled = false;
        this.environment = "disabled";
        this.sdkAvailable = false;
        this.cgSDK = null;
        this.adFrequencyCounter = 0;
    }

    async initialize() {
        console.log("Loading CrazyGames SDK...");
        
        const hasScript = typeof window !== 'undefined' && !!window.CrazyGames;
        if (hasScript) {
            console.log("SDK Loaded");
            console.log("[CrazyGames] SDK Script Loaded");
        } else {
            console.log("[CrazyGames] SDK script tag not present or blocked");
        }

        console.log("Initializing SDK...");
        console.log("[CrazyGames] Initializing SDK...");

        try {
            if (typeof window !== 'undefined' && window.CrazyGames && window.CrazyGames.SDK) {
                this.sdkAvailable = true;
                await window.CrazyGames.SDK.init();
                this.cgSDK = window.CrazyGames.SDK;
                this.initialized = true;
                this.enabled = true;
                this.environment = this.cgSDK.environment || 'crazygames';

                console.log("SDK initialized successfully");
                console.log(`[CrazyGames] SDK Initialized Successfully`);
                console.log(`Environment: ${this.environment}`);

                this.verifyModules();
                this.verifyCrazyGamesSDK();

                if (this.cgSDK.game) {
                    try {
                        this.cgSDK.game.loadingStart();
                    } catch (e) {
                        console.warn("[CrazyGames] loadingStart warning:", e);
                    }
                }
            } else {
                throw new Error("sdkDisabled");
            }
        } catch (error) {
            this.initialized = false;
            this.enabled = false;
            this.sdkAvailable = false;
            this.environment = "disabled";
            this.cgSDK = null;

            const reasonStr = error ? (error.message || String(error)) : "sdkDisabled";

            console.log("------------------------------------------------");
            console.log("CrazyGames SDK unavailable.");
            console.log("Reason:");
            console.log(reasonStr);
            console.log("Running in standalone mode.");
            console.log("Ads disabled.");
            console.log("Cloud save disabled.");
            console.log("Continue loading...");
            console.log("------------------------------------------------");
        }
    }

    verifyModules() {
        const windowCG = typeof window !== 'undefined' && !!window.CrazyGames;
        const sdkObj = typeof window !== 'undefined' && !!(window.CrazyGames && window.CrazyGames.SDK);
        const adMod = !!(this.cgSDK && this.cgSDK.ad);
        const gameMod = !!(this.cgSDK && this.cgSDK.game);
        const userMod = !!(this.cgSDK && this.cgSDK.user);
        const dataMod = !!(this.cgSDK && this.cgSDK.data);
        const bannerMod = !!(this.cgSDK && this.cgSDK.banner);

        console.log(windowCG ? "✓ window.CrazyGames exists" : "✗ window.CrazyGames missing");
        console.log(sdkObj ? "✓ SDK exists" : "✗ SDK missing");
        console.log(adMod ? "✓ ad module exists" : "✗ ad module missing");
        console.log(gameMod ? "✓ game module exists" : "✗ game module missing");
        console.log(userMod ? "✓ user module exists" : "✗ user module missing");
        console.log(dataMod ? "✓ data module exists" : "✗ data module missing");
        console.log(bannerMod ? "✓ banner module exists" : "✗ banner module missing");
    }

    verifyCrazyGamesSDK() {
        const sdkLoaded = typeof window !== 'undefined' && !!(window.CrazyGames && window.CrazyGames.SDK);
        const env = this.environment;
        const version = (this.cgSDK && this.cgSDK.version) || (sdkLoaded ? 'v3' : 'N/A');

        console.log("------------------------------------");
        console.log("CrazyGames SDK Report");
        console.log(`SDK Loaded .......... ${sdkLoaded ? 'YES' : 'NO'}`);
        console.log(`Initialized ......... ${this.initialized ? 'YES' : 'NO'}`);
        console.log(`Environment ......... ${env}`);
        console.log(`Ads Module .......... ${this.cgSDK && this.cgSDK.ad ? 'YES' : 'NO'}`);
        console.log(`Banner Module ....... ${this.cgSDK && this.cgSDK.banner ? 'YES' : 'NO'}`);
        console.log(`Game Module ......... ${this.cgSDK && this.cgSDK.game ? 'YES' : 'NO'}`);
        console.log(`User Module ......... ${this.cgSDK && this.cgSDK.user ? 'YES' : 'NO'}`);
        console.log(`Data Module ......... ${this.cgSDK && this.cgSDK.data ? 'YES' : 'NO'}`);
        console.log(`Version ............. ${version}`);
        console.log("------------------------------------");
    }

    // Safe Wrapper Methods
    async showRewardedAd(onSuccess, onFailure) {
        console.log("Rewarded Ad Requested");

        if (!this.enabled || !this.cgSDK || !this.cgSDK.ad) {
            console.log("[CrazyGames] SDK disabled, skipping showRewardedAd");
            console.log("Rewarded Ad Finished");
            if (onSuccess) onSuccess();
            return;
        }

        try {
            if (window.game && window.game.sound) {
                window.game.sound.mute = true;
            }

            await this.cgSDK.ad.requestAd('rewarded', {
                adStarted: () => {
                    console.log("[CrazyGames] Rewarded ad started");
                },
                adFinished: () => {
                    console.log("Rewarded Ad Finished");
                    if (window.game && window.game.sound) {
                        window.game.sound.mute = false;
                    }
                    if (onSuccess) onSuccess();
                },
                adError: (error) => {
                    console.log("Rewarded Ad Failed:", error ? (error.message || error) : 'Ad error');
                    if (window.game && window.game.sound) {
                        window.game.sound.mute = false;
                    }
                    if (onFailure) {
                        onFailure(error);
                    } else if (onSuccess) {
                        onSuccess();
                    }
                }
            });
        } catch (e) {
            console.log("Rewarded Ad Failed:", e ? (e.message || e) : 'Exception');
            if (window.game && window.game.sound) {
                window.game.sound.mute = false;
            }
            if (onFailure) {
                onFailure(e);
            } else if (onSuccess) {
                onSuccess();
            }
        }
    }

    async showMidgameAd(onComplete) {
        console.log("Midgame Ad Requested");

        if (!this.enabled || !this.cgSDK || !this.cgSDK.ad) {
            console.log("[CrazyGames] SDK disabled, skipping showMidgameAd");
            console.log("Midgame Ad Finished");
            if (onComplete) onComplete();
            return;
        }

        if (window.game && window.game.sound) {
            window.game.sound.mute = true;
        }

        try {
            await this.cgSDK.ad.requestAd('midroll', {
                adStarted: () => {
                    console.log("[CrazyGames] Midroll ad started");
                },
                adFinished: () => {
                    console.log("Midgame Ad Finished");
                    if (window.game && window.game.sound) {
                        window.game.sound.mute = false;
                    }
                    if (onComplete) onComplete();
                },
                adError: (error) => {
                    console.log("Midgame Ad Failed:", error ? (error.message || error) : 'Ad error');
                    if (window.game && window.game.sound) {
                        window.game.sound.mute = false;
                    }
                    if (onComplete) onComplete();
                }
            });
        } catch (e) {
            console.log("Midgame Ad Failed:", e ? (e.message || e) : 'Exception');
            if (window.game && window.game.sound) {
                window.game.sound.mute = false;
            }
            if (onComplete) onComplete();
        }
    }

    async showBanner(containerId, width, height) {
        console.log("Banner Requested");

        if (!this.enabled || !this.cgSDK || !this.cgSDK.banner) {
            console.log("[CrazyGames] SDK disabled, skipping showBanner");
            console.log("Banner Finished");
            return;
        }

        try {
            await this.cgSDK.banner.requestBanner({
                containerId: containerId,
                width: width || 300,
                height: height || 250
            });
            console.log("Banner Finished");
        } catch (e) {
            console.log("Banner Failed:", e ? (e.message || e) : 'Exception');
        }
    }

    gameplayStart() {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.game) {
            console.log("[CrazyGames] SDK disabled, skipping gameplayStart");
            return;
        }
        console.log("Gameplay Start");
        try {
            this.cgSDK.game.gameplayStart();
        } catch (e) {
            console.warn("[CrazyGames] gameplayStart warning:", e);
        }
    }

    gameplayStop() {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.game) {
            console.log("[CrazyGames] SDK disabled, skipping gameplayStop");
            return;
        }
        console.log("Gameplay Stop");
        try {
            this.cgSDK.game.gameplayStop();
        } catch (e) {
            console.warn("[CrazyGames] gameplayStop warning:", e);
        }
    }

    happytime() {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.game) {
            console.log("[CrazyGames] SDK disabled, skipping happytime");
            return;
        }
        try {
            this.cgSDK.game.happytime();
        } catch (e) {
            console.warn("[CrazyGames] happytime warning:", e);
        }
    }

    inviteLink(params) {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.game) {
            console.log("[CrazyGames] SDK disabled, skipping inviteLink");
            return null;
        }
        try {
            return this.cgSDK.game.inviteLink(params);
        } catch (e) {
            console.warn("[CrazyGames] inviteLink warning:", e);
            return null;
        }
    }

    async cloudSave(data) {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.user) {
            console.log("[CrazyGames] SDK disabled, skipping cloudSave");
            return false;
        }
        try {
            if (this.cgSDK.data && this.cgSDK.data.setItem) {
                await this.cgSDK.data.setItem('userSaveData', JSON.stringify(data));
                return true;
            }
        } catch (e) {
            console.warn("[CrazyGames] cloudSave failed:", e);
        }
        return false;
    }

    async cloudLoad() {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.user) {
            console.log("[CrazyGames] SDK disabled, skipping cloudLoad");
            return null;
        }
        try {
            if (this.cgSDK.data && this.cgSDK.data.getItem) {
                const data = await this.cgSDK.data.getItem('userSaveData');
                return data ? JSON.parse(data) : null;
            }
        } catch (e) {
            console.warn("[CrazyGames] cloudLoad failed:", e);
        }
        return null;
    }

    onAssetsLoaded() {
        if (!this.enabled || !this.cgSDK || !this.cgSDK.game) {
            console.log("[CrazyGames] SDK disabled, skipping onAssetsLoaded / loadingStop");
            return;
        }
        try {
            this.cgSDK.game.loadingStop();
        } catch (e) {
            console.warn("[CrazyGames] loadingStop failed:", e);
        }
    }

    trackGameActionForAds(onComplete) {
        this.adFrequencyCounter++;
        console.log(`[CrazyGames] Ad frequency counter: ${this.adFrequencyCounter}/5`);

        if (this.adFrequencyCounter >= 5) {
            this.adFrequencyCounter = 0;
            this.showMidgameAd(onComplete);
        } else {
            if (onComplete) onComplete();
        }
    }
}

const CrazyGamesManager = new CrazyGamesManagerClass();

if (typeof window !== 'undefined') {
    window.CrazyGamesManager = CrazyGamesManager;
    window.verifyCrazyGamesSDK = () => CrazyGamesManager.verifyCrazyGamesSDK();
}

export default CrazyGamesManager;

// Convenience export aliases for easy named imports
export const initCrazyGamesSDK = () => CrazyGamesManager.initialize();
export const showRewardedAd = (onSuccess, onFailure) => CrazyGamesManager.showRewardedAd(onSuccess, onFailure);
export const playRewardedAd = (onSuccess, onFailure) => CrazyGamesManager.showRewardedAd(onSuccess, onFailure);
export const showMidgameAd = (onComplete) => CrazyGamesManager.showMidgameAd(onComplete);
export const playMidrollAd = (onComplete) => CrazyGamesManager.showMidgameAd(onComplete);
export const showBanner = (containerId, width, height) => CrazyGamesManager.showBanner(containerId, width, height);
export const requestBanner = (containerId, width, height) => CrazyGamesManager.showBanner(containerId, width, height);
export const gameplayStart = () => CrazyGamesManager.gameplayStart();
export const gameplayStop = () => CrazyGamesManager.gameplayStop();
export const happytime = () => CrazyGamesManager.happytime();
export const inviteLink = (params) => CrazyGamesManager.inviteLink(params);
export const cloudSave = (data) => CrazyGamesManager.cloudSave(data);
export const cloudLoad = () => CrazyGamesManager.cloudLoad();
export const onAssetsLoaded = () => CrazyGamesManager.onAssetsLoaded();
export const trackGameActionForAds = (onComplete) => CrazyGamesManager.trackGameActionForAds(onComplete);
export const verifyCrazyGamesSDK = () => CrazyGamesManager.verifyCrazyGamesSDK();
