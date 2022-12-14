import AdvancedSearch, { SearchOptions } from "@/components/AdvancedSearch";
import ErrorBoundary from "@/components/ErrorBoundary";
import SearchResults from "@/components/SearchResults";
import { firstQueryParam } from "@/lib/router";
import {
  Button,
  Group,
  Loader,
  ThemeIcon,
  Text,
  createStyles,
  Space,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { IconBrandGithub } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Suspense, useMemo } from "react";

const useStyles = createStyles((theme) => ({
  sidebar: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: "300px",
    padding: `0 ${theme.spacing.sm}px ${theme.spacing.sm}px`,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: theme.breakpoints.sm,
  },
}));

const Search: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const query = firstQueryParam(router.query.q) ?? "";
  const fullName = firstQueryParam(router.query.fullname) ?? "";
  const location = firstQueryParam(router.query.loc) ?? "";
  const followers = firstQueryParam(router.query.followers) ?? "";
  const repos = firstQueryParam(router.query.repos) ?? "";
  const lang = firstQueryParam(router.query.lang) ?? "";

  const composedQuery = composeQuery({
    query,
    fullName,
    location,
    followers,
    repos,
    lang,
  });

  const initialSearch = useMemo(
    () => ({ query, fullName, location, followers, repos, lang }),
    [followers, fullName, lang, location, query, repos]
  );

  return (
    <Group align="start">
      <aside className={classes.sidebar}>
        <Group align="center" sx={{ height: "56px" }}>
          <NextLink href="/" aria-label="Home page">
            <ThemeIcon color="dark">
              <IconBrandGithub />
            </ThemeIcon>
          </NextLink>
          <Text component="h1" m={0}>
            GitHub user search
          </Text>
        </Group>

        <AdvancedSearch
          initial={initialSearch}
          onApply={(search) => {
            const params = new URLSearchParams();

            if (search.query) {
              params.set("q", search.query);
            }

            if (search.fullName.length) {
              params.set("fullname", search.fullName);
            }

            if (search.location.length) {
              params.set("loc", search.location);
            }
            if (search.followers.length) {
              params.set("followers", search.followers);
            }
            if (search.repos.length) {
              params.set("repos", search.repos);
            }
            if (search.lang.length) {
              params.set("lang", search.lang);
            }

            router.replace(`/search?${params.toString()}`);
          }}
        />
      </aside>
      <div role="main" className={classes.content}>
        <ErrorBoundary>
          <Suspense
            fallback={
              <Group position="center">
                <Loader />
              </Group>
            }
          >
            {query.length ? (
              <SearchResults
                query={composedQuery}
                pagination={({ hasNextPage }, loadMore, isLoading) =>
                  hasNextPage ? (
                    <Group position="center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMore}
                        disabled={isLoading}
                      >
                        Load more
                      </Button>
                    </Group>
                  ) : null
                }
              />
            ) : null}
          </Suspense>
        </ErrorBoundary>
        <Space h="lg" />
      </div>
    </Group>
  );
};

export default Search;

function composeQuery(search: Partial<SearchOptions>) {
  let query = search.query ?? "";

  if (search.fullName?.length) {
    query = `${query} fullname:"${search.fullName}"`;
  }

  if (search.location?.length) {
    query = `${query} location:"${search.location}"`;
  }

  if (search.followers?.length) {
    query = `${query} followers:"${search.followers}"`;
  }

  if (search.repos?.length) {
    query = `${query} repos:"${search.repos}"`;
  }

  if (search.lang?.length) {
    query = `${query} language:"${search.lang}"`;
  }

  return query;
}
