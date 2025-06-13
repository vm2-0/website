export function playTrainingSound(type: 'reward' | 'other') {
    const audio = new Audio(type === 'reward' ? '/sounds/success.wav' : '/sounds/tone.wav');
    audio.play().catch(err => {
        console.error('Error playing sound:', err);
    });
}
