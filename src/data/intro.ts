/**
 * @file intro.ts
 * @description Static content for the intro section.
 */

export const introData = {
    title: "Hey, I'm Marco.",
    bio: `I am a Software Engineer passionate about 3D data visualization and building immersive web experiences. 
          I bridge the gap between complex technical systems and engaging user interfaces.`,
    buttons: [
        { label: 'Get in Touch', primary: true, onClick: () => console.log('Contact clicked') },
        { label: 'View Resume', primary: false, onClick: () => console.log('Resume clicked') }
    ]
};
