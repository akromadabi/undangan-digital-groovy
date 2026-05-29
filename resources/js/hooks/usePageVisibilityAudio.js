import { useEffect, useRef } from 'react';

/**
 * A custom React hook that handles pausing the invitation audio when the tab is hidden
 * and automatically resuming it when returning, only if it was playing previously.
 * 
 * @param {React.RefObject<HTMLAudioElement>} audioRef Ref to the audio element
 * @param {boolean} isPlaying Active playing state
 * @param {Function} setIsPlaying State setter to toggle play/pause state
 */
export default function usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying) {
    const wasPlayingRef = useRef(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!audioRef.current) return;

            if (document.hidden) {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                    wasPlayingRef.current = true;
                }
            } else {
                if (wasPlayingRef.current) {
                    audioRef.current.play()
                        .then(() => {
                            setIsPlaying(true);
                            wasPlayingRef.current = false;
                        })
                        .catch((err) => {
                            console.warn("Failed to auto-resume audio on visibility change:", err);
                        });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [audioRef, isPlaying, setIsPlaying]);
}
