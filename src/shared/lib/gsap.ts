import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip, ScrollTrigger, TextPlugin, ScrollToPlugin);

export { gsap, SplitText, Flip, ScrollTrigger, TextPlugin, ScrollToPlugin };
