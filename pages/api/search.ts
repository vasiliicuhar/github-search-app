import { firstQueryParam } from "@/lib/router";
import { GithubSearchResponse, SearchResponse } from "@/lib/types/search";
import request, { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

const GITHUB_API = "https://api.github.com/graphql";
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN ?? "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  const query = firstQueryParam(req.query.q) ?? "";
  const start = firstQueryParam(req.query.start);
  const limit = Number(firstQueryParam(req.query.limit)) || 10;

  const data: GithubSearchResponse = await request(
    GITHUB_API,
    gql`
      query ($query: String!, $start: String, $limit: Int!) {
        search(query: $query, type: USER, first: $limit, after: $start) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          userCount
          nodes {
            __typename
            ...BaseFields
            ...UserFields
            ...OrgFields
          }
        }
      }

      fragment BaseFields on RepositoryOwner {
        avatarUrl
        login
        url

        repositories(
          first: 3
          orderBy: { direction: DESC, field: STARGAZERS }
        ) {
          totalCount
          nodes {
            name
            url
          }
        }
      }

      fragment UserFields on User {
        company
        name
        followers {
          totalCount
        }
      }

      fragment OrgFields on Organization {
        name
        description
      }
    `,
    {
      query,
      start,
      limit,
    },
    {
      authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    }
  );

  res.status(200).json({
    totalCount: data.search.userCount,
    pageInfo: data.search.pageInfo,
    results: data.search.nodes,
  });
}
