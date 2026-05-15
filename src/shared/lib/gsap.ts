import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/all';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip);

export { gsap, SplitText, Flip };
