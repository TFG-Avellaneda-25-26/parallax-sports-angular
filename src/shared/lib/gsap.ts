import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, SplitText);

export { gsap, SplitText };
