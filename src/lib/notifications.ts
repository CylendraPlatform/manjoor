/**
 * Play a notification sound
 * Note: Browsers usually block audio unless there has been user interaction first.
 */
export const playNotificationSound = () => {
    try {
        // Using a short, high-quality notification sound from a CDN
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.volume = 0.5;
        audio.play().catch(err => {
            console.warn("Sound playback prevented by browser policy. Interaction needed first.", err);
        });
    } catch (error) {
        console.error("Error playing notification sound:", error);
    }
};
