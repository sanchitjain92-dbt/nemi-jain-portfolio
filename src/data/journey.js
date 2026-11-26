// Career journey content (Career section). Edit here to update the map, ruler, tabs and chapters.
// Coordinates are [longitude, latitude]; `level` indexes LEVELS (the altimeter).

export const LEVELS = ['Student', 'Lecturer', 'Postdoc', 'Research Chemist', 'Senior Scientist', 'Team Leader', 'Senior Manager', 'Advisor'];

export const journey = [
  {
    code: 'JAI', city: 'Jaipur', region: 'Rajasthan, India', country: 'in', coords: [75.79, 26.91], level: 0,
    start: 1968, end: 1976, years: '1968–1978', mark: '1968',
    title: 'A chemist in the making',
    summary: 'Undergraduate, master’s and doctoral study at the University of Rajasthan, researching heterometallic alkoxides in the school of Prof. R. C. Mehrotra.',
    items: [
      ['1968–71', 'B.Sc., Science', 'University of Rajasthan'],
      ['1971–73', 'M.Sc., Chemistry', 'University of Rajasthan'],
      ['1972', 'Summer Institute for Meritorious PG Chemistry Students', 'Sardar Patel University'],
      ['1973–78', 'Ph.D., Chemistry — Research Scholar', 'Papers presented in Vienna and Prague, 1978'],
    ],
  },
  {
    code: 'DEL', city: 'New Delhi', region: 'India', country: 'in', coords: [77.21, 28.61], level: 1,
    start: 1976, end: 1983, years: '1976–1983', mark: '1976',
    title: 'Teaching the next generation',
    summary: 'Lecturer at NCERT and then the University of Delhi, while continuing to publish in organometallic and coordination chemistry.',
    items: [
      ['1976–77', 'Lecturer in Science', 'NCERT'],
      ['1977–83', 'Lecturer in Chemistry', 'University of Delhi'],
      ['1979', 'Organometallic Chemistry', 'University of Lucknow'],
      ['1983', 'National Scholarship for Study Abroad', 'Ministry of Education, Government of India'],
    ],
  },
  {
    code: 'CHO', city: 'Charlottesville', region: 'Virginia, USA', country: 'us', coords: [-78.48, 38.03], level: 2,
    start: 1983, end: 1985, years: '1983–1985', mark: '1983',
    title: 'A new country, a new lab',
    summary: 'Arrived in the United States as a Government of India National Scholar for postdoctoral research.',
    items: [
      ['1983–85', 'Post-doctoral Associate, Chemistry', 'University of Virginia'],
      ['1983', '16th Rare Earth Research Conference', 'Tallahassee, Florida'],
      ['1984', 'International Conference on Coordination Chemistry', 'Boulder, Colorado'],
    ],
  },
  {
    code: 'FNL', city: 'Fort Collins', region: 'Colorado, USA', country: 'us', coords: [-105.08, 40.59], level: 2,
    start: 1985, end: 1989, years: '1985–1989', mark: '',
    title: 'Modelling nature’s catalysts',
    summary: 'Postdoctoral work on synthetic models of metalloenzyme active sites — nitrogenase and cytochrome c oxidase.',
    items: [
      ['1985–89', 'Post-doctoral Associate, Chemistry', 'Colorado State University'],
      ['1987', 'Paper in Inorganic Chemistry', 'Cytochrome c oxidase active-site model'],
      ['1987', '193rd ACS National Meeting', 'Denver, Colorado'],
    ],
  },
  {
    code: 'CHI', city: 'Chicago', region: 'Illinois, USA', country: 'us', coords: [-87.63, 41.88], level: 3, sherwin: true,
    start: 1989, end: 1990.5, years: '1989', mark: '1989',
    title: 'Into industry',
    summary: 'Joined The Sherwin-Williams Company in Analytical Sciences, beginning a 35-year industrial career.',
    items: [
      ['1989', 'Research Chemist, Analytical Sciences', 'The Sherwin-Williams Company'],
      ['1990', 'Coatings Science', 'North Dakota State University'],
    ],
  },
  {
    code: 'CLE', city: 'Cleveland', region: 'Ohio, USA', country: 'us', coords: [-81.69, 41.5], level: 6, sherwin: true,
    start: 1990.5, end: 2025, years: '1990s–2025', mark: '',
    title: 'Building labs, leading people',
    summary: 'Set up laboratories and supported customers across five coatings markets, rising to senior manager and chair of the analytical communities of practice.',
    items: [
      ['', 'Senior Scientist → Team Leader → Senior Manager', 'Promotions shown in order'],
      ['2003', 'Grand Awards Judge, Chemistry', 'Intel International Science & Engineering Fair'],
      ['2012–13', 'President, Board of Trustees', 'Cleveland Coatings Society'],
      ['2025', 'Retired after 35 years', 'The Sherwin-Williams Company'],
    ],
  },
  {
    code: 'ADV', city: 'Ohio & the world', region: 'Advisory', country: 'us', coords: [-81.69, 41.5], level: 7,
    start: 2025, end: 2027, years: '2025 —', mark: '2025',
    title: 'Giving it forward',
    summary: 'Advising chemists, consulting on R&D and volunteering internationally for girls’ education and women’s empowerment.',
    items: [
      ['2025', 'ACS Career Consultant', 'American Chemical Society'],
      ['2025', 'Sustainable Supply Chain Management', 'University of Cambridge'],
      ['2025', 'United Nations Online Volunteer', 'UN Volunteers · UNDP'],
      ['2026', 'Chemical Consultant', 'Chemical Consultants Network'],
    ],
  },
];

export const journeyEras = [
  { from: 1968, to: 1983, label: 'India', color: '#c9862e' },
  { from: 1983, to: 1989, label: 'Postdoc · USA', color: '#2f6b6a' },
  { from: 1989, to: 2025, label: 'The Sherwin-Williams Company', color: '#3b5878' },
  { from: 2025, to: 2027, label: 'Advisory', color: '#9e3b32' },
];

// International conferences reached from Delhi-era research (from ORCID).
export const researchTrips = [
  { city: 'Prague', year: '1978', at: [628, 214] },
  { city: 'Vienna', year: '1978', at: [642, 240] },
  { city: 'Budapest', year: '1982', at: [656, 266] },
];
