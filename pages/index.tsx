import {
  Container,
  ThemeIcon,
  Text,
  Group,
  Loader,
  Space,
  Button,
} from "@mantine/core";
import type { NextPage } from "next";
import { IconBrandGithub } from "@tabler/icons";
import { Suspense, useState, useTransition } from "react";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NextLink } from "@mantine/next";

const Home: NextPage = () => {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  return (
    <Container size="xs" pt="sm" role="main">
      <Group>
        <ThemeIcon color="dark">
          <IconBrandGithub />
        </ThemeIcon>
        <Text component="h1">GitHub user search</Text>
      </Group>

      <SearchForm
        isPending={isPending}
        onChange={(val) =>
          startTransition(() => {
            setQuery(val);
          })
        }
      />
      <Text size="sm" variant="link" component={NextLink} href="/search">
        Advanced search
      </Text>

      <Space h="sm" />

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
              query={query}
              pageSize={5}
              pagination={({ hasNextPage }) =>
                hasNextPage ? (
                  <Group position="center">
                    <Button
                      component={NextLink}
                      href={`/search?q=${encodeURIComponent(query)}`}
                      variant="outline"
                      size="sm"
                    >
                      See more
                    </Button>
                  </Group>
                ) : null
              }
            />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
};

export default Home;
