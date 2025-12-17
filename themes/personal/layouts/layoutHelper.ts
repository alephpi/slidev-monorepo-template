
/**
 * Resolve urls from frontmatter and append with the base url
 */
export function resolveAssetUrl(url: string) {
  if (url.startsWith('/'))
    return import.meta.env.BASE_URL + url.slice(1)
  return url
}

interface Author {
  [key: string]: string[];
}


interface InstitutionMap {
  [key: string]: number;
}

interface AuthorInstitutions {
  instituteNum: number[];
  instituteName: string[];
}

interface AuthorsDict {
  [key: string]: AuthorInstitutions;
}

export function handleAuthor(authors: Author): [AuthorsDict, { name: string, content: string }[]] {
  //r Step 1: Collect all unique institutions and assign a unique number to each
  const allInstitutions: InstitutionMap = {};
  let institutionIndex = 1;

  authors.forEach((authorObj: Author) => {
    const institutions: string[] = Object.values(authorObj)[0];
    institutions.forEach((institute: string) => {
      if (!allInstitutions[institute]) {
        allInstitutions[institute] = institutionIndex++;
      }
    });
  });

  // Step 2: Map each author to their institutions' numbers and names
  const authorsDict: AuthorsDict = authors.reduce((acc: AuthorsDict, authorObj: Author) => {
    const authorName: string = Object.keys(authorObj)[0];
    const institutions: string[] = authorObj[authorName];

    const institutionsData: AuthorInstitutions = {
      instituteNum: [],
      instituteName: [],
    };

    institutions.forEach((institute: string) => {
      institutionsData.instituteNum.push(allInstitutions[institute]);
      institutionsData.instituteName.push(institute);
    });

    acc[authorName] = institutionsData;

    return acc;
  }, {});

  return [authorsDict, Object.entries(allInstitutions).map(([key, value]) => {
    return { "number": value, "content": key };
  })];
}
