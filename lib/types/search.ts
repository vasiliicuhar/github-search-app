type GithubRepositoryOwner = {
  avatarUrl: string;
  login: string;
  url: string;

  repositories: {
    totalCount: number;
    nodes: {
      name: string;
      url: string;
    }[];
  };
};

export type GithubUser = {
  __typename: "User";
  company: string | null;
  name: string;

  followers: {
    totalCount: number;
  };
} & GithubRepositoryOwner;

export type GithubOrganization = {
  __typename: "Organization";
  name: string;
} & GithubRepositoryOwner;

export type GithubSearchResultItem = GithubUser | GithubOrganization;

export type GithubPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

export type GithubSearchResponse = {
  search: {
    userCount: number;
    pageInfo: GithubPageInfo;
    nodes: GithubSearchResultItem[];
  };
};

export type SearchResponse = {
  totalCount: number;
  pageInfo: GithubPageInfo;
  results: GithubSearchResultItem[];
};
