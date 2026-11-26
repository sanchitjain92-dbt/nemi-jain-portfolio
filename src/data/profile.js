// Single source of truth for all site content — edit here to update the website.

export const profile = {
  name: 'Nemi Jain',
  honorific: 'Dr.',
  photo: '/nemi.jpg',
  location: 'Cleveland, Ohio',
  tagline: ['Chemist', 'R&D Leader', 'Mentor'],
  statement:
    'Five decades in chemistry — from organometallic research in India and postdoctoral work in the United States to 35 years in analytical science and R&D leadership at The Sherwin-Williams Company. Today, an American Chemical Society Career Consultant, independent R&D advisor and United Nations volunteer.',
  currentTitle: 'R&D Senior Manager (Ret.), The Sherwin-Williams Company',
  links: {
    linkedin: 'https://www.linkedin.com/in/nemijain',
    acs: 'https://www.acs.org/careers/career-consultants/nemi-jain.html',
    ccn: 'https://chemconsultants.org/Sys/PublicProfile/96262278',
    orcid: 'https://orcid.org/0000-0002-4617-4183',
  },
};

export const stats = [
  { value: 35, suffix: '', label: 'Years in coatings R&D at Sherwin-Williams' },
  { value: 38, suffix: '', label: 'Publications & conference presentations' },
  { value: 45, prefix: '$', suffix: 'K+', label: 'Raised for the American Cancer Society' },
  { value: 20, suffix: '+', label: 'Years of community leadership' },
];

export const about = {
  lead:
    'Dr. Nemi Jain is a chemist, R&D leader and educator whose career bridges academia and industry — and whose life is defined as much by service as by science.',
  paragraphs: [
    'He earned his B.Sc., M.Sc. and Ph.D. in Chemistry at the University of Rajasthan, researching heterometallic alkoxides in the school of Prof. R. C. Mehrotra. He then lectured at NCERT and the University of Delhi, and — as a Government of India National Scholar for Study Abroad — held postdoctoral appointments at the University of Virginia and Colorado State University.',
    'In 1989 he joined The Sherwin-Williams Company. Over 35 years in Chicago and Cleveland he set up laboratories, supported customers, and rose from research chemist to senior manager and chair of the company’s analytical communities of practice — leading multidisciplinary teams across coatings technology, materials characterization, regulatory systems and sustainability.',
    'He now invests that experience in people — advising chemists through the American Chemical Society, consulting on R&D strategy, mentoring college-bound students, and volunteering with the United Nations for girls’ education and women’s empowerment.',
  ],
  focus: [
    { title: 'Science', text: 'Inorganic, polymer, materials and analytical chemistry applied to industrial coatings.' },
    { title: 'Leadership', text: 'Built laboratories, led R&D teams and chaired analytical communities of practice.' },
    { title: 'Education', text: 'Lecturer, short-course instructor, mentor and career consultant.' },
    { title: 'Service', text: 'Two decades of community and international volunteerism.' },
  ],
};

export const markets = [
  { name: 'Automotive', chip: 'Lacquer Red', code: 'NJ-01', color: '#9E3B32', desc: 'Durable, high-gloss finishes engineered for precision.' },
  { name: 'Aerospace', chip: 'Stratus Blue', code: 'NJ-02', color: '#3B5878', desc: 'Coatings for extreme environments and exacting specifications.' },
  { name: 'Wood', chip: 'Walnut', code: 'NJ-03', color: '#7A5536', desc: 'Finishes that protect and celebrate natural grain.' },
  { name: 'General Industrial', chip: 'Graphite', code: 'NJ-04', color: '#4A4F57', desc: 'Robust, cost-effective protection across countless products.' },
  { name: 'Protective & Marine', chip: 'Harbor Teal', code: 'NJ-05', color: '#2F6B6A', desc: 'Corrosion defense for infrastructure, vessels and offshore assets.' },
];

export const toolkit = [
  { group: 'Chromatography', items: [['GPC', 'Gel Permeation Chromatography'], ['HPLC', 'High-Performance Liquid Chromatography'], ['GC', 'Gas Chromatography'], ['Py-GC/MS', 'Pyrolysis GC / Mass Spectrometry']] },
  { group: 'Spectroscopy & Spectrometry', items: [['ICP-MS', 'Inductively Coupled Plasma Mass Spectrometry'], ['FTIR', 'Fourier-Transform Infrared'], ['NMR', 'Nuclear Magnetic Resonance'], ['MALDI', 'Matrix-Assisted Laser Desorption/Ionization'], ['XRF', 'X-Ray Fluorescence']] },
  { group: 'Microscopy', items: [['SEM', 'Scanning Electron Microscopy'], ['TEM', 'Transmission Electron Microscopy'], ['AFM', 'Atomic Force Microscopy']] },
  { group: 'Thermal Analysis', items: [['DSC', 'Differential Scanning Calorimetry'], ['TGA', 'Thermogravimetric Analysis']] },
];

export const leadership = [
  {
    title: 'Career Consultant',
    org: 'American Chemical Society',
    text: 'Selected as an ACS Career Consultant, advising chemists on the transition from academia to industry.',
    icon: 'Atom',
    link: 'https://www.acs.org/careers/career-consultants/nemi-jain.html',
  },
  {
    title: 'Past President & Board Member',
    org: 'Cleveland Coatings Society',
    text: 'President of the Board of Trustees (2012–13); symposium chair and short-course instructor for coatings formulators.',
    icon: 'Layers',
  },
  {
    title: 'R&D Consultant',
    org: 'R&D Solutions and Management',
    text: 'Advising organizations on coatings, polymers, analytical chemistry, product development and R&D management.',
    icon: 'Lightbulb',
    link: 'https://chemconsultants.org/Sys/PublicProfile/96262278',
  },
  {
    title: 'Mentor',
    org: 'College Now Greater Cleveland',
    text: 'Increasing college attainment through advising, mentoring and scholarships.',
    icon: 'GraduationCap',
  },
];

export const honors = [
  { year: '2026', title: 'Chemical Consultant', org: 'Chemical Consultants Network' },
  { year: '2025', title: 'Career Consultant', org: 'American Chemical Society' },
  { year: '2025', title: 'Editorial Board Member', org: 'International Journal of Social Science & Applied Technology' },
  { year: '2023', title: 'Invited Seminar Speaker', org: 'The College of Wooster' },
  { year: '2012', title: 'President, Board of Trustees', org: 'Cleveland Coatings Society' },
  { year: '2010', title: 'Technical Symposium Chair & Moderator', org: 'Sink or Swim Symposium' },
  { year: '2003', title: 'Grand Awards Judge, Chemistry', org: 'Intel International Science & Engineering Fair' },
  { year: '1983', title: 'National Scholarship for Study Abroad', org: 'Government of India' },
  { year: '1983', title: 'Member — now Emeritus', org: 'American Chemical Society' },
];

export const service = [
  { role: 'Team Captain', org: 'Relay for Life, Wayne County', since: 2004, cause: 'Health', text: 'More than $45,000 raised for the American Cancer Society.', color: '#C46A5A' },
  { role: 'Treasurer', org: 'Jain Society of Greater Cleveland', since: 2011, cause: 'Community', text: 'Stewarding a community devoted to non-violence, vegetarianism and world peace.', color: '#C9A24B' },
  { role: 'Mentor', org: 'College Now Greater Cleveland', since: 2022, cause: 'Education', text: 'Guiding students toward college through advising, mentoring and scholarship.', color: '#7FA79A' },
  { role: 'Volunteer', org: 'United Nations', since: 2025, cause: 'Education', text: 'Fundraising, school building and girls’ education.', color: '#7C98BA' },
  { role: 'Grant Research & Proposals', org: 'United Nations Volunteers', since: 2025, cause: 'Human Rights', text: 'Water & sanitation, girls’ education in rural Africa, vulnerable children in Uganda, women’s empowerment in Iraq.', color: '#A08CB8' },
  { role: 'Member', org: 'Rotary International', since: 2026, cause: 'Community', text: 'Member of the Rotary club in Wooster, Ohio.', color: '#B8B2A6' },
];

export const writings = [
  {
    date: 'January 2026',
    kind: 'Announcement',
    title: 'Selected as an American Chemical Society Career Consultant',
    url: 'https://www.linkedin.com/posts/nemijain_nemi-jain-american-chemical-society-activity-7414360771293241344-_fke',
  },
  {
    date: 'August 2025',
    kind: 'Reflection',
    title: 'Volunteering with UNDP on women’s empowerment in Iraq',
    url: 'https://www.linkedin.com/posts/nemijain_excellent-experience-in-volunteerng-at-undps-activity-7366596288601092100-gb88',
  },
  {
    date: 'September 2020',
    kind: 'Article',
    title: 'Forgiveness offers benefits at work places',
    url: 'https://www.linkedin.com/pulse/forgiveness-offers-benefits-work-places-nemi-jain',
  },
];

// Photos: put files in /public/photos and list them here, e.g.
// { src: '/photos/acs-2016.jpg', alt: 'Dr. Jain speaking at the Cleveland ACS section', caption: 'Cleveland ACS', year: 2016 }
export const gallery = [];

// YouTube talks: the id is the part after "v=" in the URL, e.g.
// { title: 'Analytical Sciences for Formulators', youtubeId: 'dQw4w9WgXcQ', event: 'Sink or Swim', year: 2012 }
export const videos = [];
