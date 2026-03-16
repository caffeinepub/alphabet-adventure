export function useSound() {
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.78;
    utterance.pitch = 1.3;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playTones = (frequencies: number[], noteDuration = 0.25) => {
    try {
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass() as AudioContext;
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * noteDuration;
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + noteDuration);
        osc.start(t);
        osc.stop(t + noteDuration + 0.05);
      });
    } catch {
      // audio not supported
    }
  };

  const playCorrect = () => playTones([261.63, 329.63, 392], 0.18);
  const playWrong = () => playTones([180, 150], 0.3);
  const playStarEarned = () =>
    playTones([523.25, 659.25, 783.99, 1046.5], 0.14);
  const playClick = () => playTones([440], 0.08);

  return { speak, playCorrect, playWrong, playStarEarned, playClick };
}
