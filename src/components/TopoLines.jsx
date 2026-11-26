// Faint topographic contour lines used as a subtle section background.
const VARIANTS = {
  hero: [
    'M560 720 C600 520 700 440 800 410 C900 380 960 290 1060 160',
    'M620 720 C650 540 730 480 820 455 C920 430 980 360 1060 230',
    'M500 720 C560 480 680 380 780 350 C890 320 950 200 1040 -20',
    'M440 720 C520 440 660 320 760 290 C870 260 920 140 980 -20',
    'M700 720 C720 600 780 560 860 540 C960 520 1010 470 1060 420',
  ],
  journey: [
    'M-40 620 C180 580 300 480 520 460 C740 440 820 330 1040 280',
    'M-40 680 C200 640 320 540 540 520 C760 500 840 400 1040 350',
    'M-40 560 C160 530 280 420 500 400 C720 380 800 260 1040 210',
    'M-40 740 C220 700 340 610 560 590 C780 570 860 470 1040 430',
    'M600 -20 C660 120 780 160 900 170 C980 176 1020 210 1060 260',
  ],
};

export default function TopoLines({ variant = 'hero' }) {
  return (
    <svg className="topo" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke">
        {VARIANTS[variant].map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
