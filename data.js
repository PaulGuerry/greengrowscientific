/* ------------------------------------------------------------------
   Content for Green Grow Scientific.
   Edit this file to update the site — nothing else needs to change.
   ------------------------------------------------------------------ */

window.GGS_DATA = {

  home: {
    lede: 'Green Grow Scientific is a scientific research and writing practice ' +
          'working on clinical data, rare disease, and reproducible analysis.'
  },

  /* Where the "Full list on Google Scholar" link points. */
  scholarUrl: 'https://scholar.google.fr/citations?user=A_fc_cAAAAAJ&hl=en',

  /* ------------------------------------------------------------------
     RESEARCH — publications, one object per paper.
     `year` is used for sorting and for the year headings.
     `url` is optional (DOI, PubMed, PDF…).
     Copy the entries across from Google Scholar; the list is displayed
     in reverse chronological order automatically.
     ------------------------------------------------------------------ */
  publications: [
    {
      year: 2025,
      authors: 'Lastname A, Lastname B, Lastname C.',
      title: 'Replace this with the real title of the paper.',
      venue: 'Journal Name 12(3):456-789.',
      url: 'https://doi.org/10.0000/example'
    },
    {
      year: 2024,
      authors: 'Lastname A, Lastname D.',
      title: 'Second example entry — delete me.',
      venue: 'Another Journal 5:1-10.',
      url: ''
    }
  ],

  /* ------------------------------------------------------------------
     WRITING — PDFs. Upload the files into the /pdfs folder, then list
     them here. `date` is "YYYY-MM" or "YYYY".
     ------------------------------------------------------------------ */
  writing: [
    {
      title: 'Example article title',
      date: '2025-03',
      file: 'pdfs/example-article.pdf',
      description: 'One-line description (optional).'
    }
  ],

  /* ------------------------------------------------------------------
     RESOURCES — sites you have built. Leave `url` empty for anything
     not yet public; it will render as plain text.
     ------------------------------------------------------------------ */
  resources: [
    {
      name: 'Pytheas DB',
      url: 'https://pytheasdb.com',
      description: 'Database of rare pediatric digestive diseases.'
    },
    {
      name: 'ALPHI',
      url: 'https://alphi.pytheasdb.com',
      description: 'Agnostic latent phenotype identification.'
    },
    {
      name: 'Data collection helper',
      url: '',
      description: 'Internal tool for structured data collection.'
    }
  ],

  quote: {
    email: 'hello@greengrowscientific.com'
  }
};